"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { MarketDataType, type BetHistoryEntry } from "@/types/type";
import { API_BASE_URL } from "@/config/api";

const stripTrailingSlashes = (value: string) => value.replace(/\/+$/, "");

const deriveSocketUrl = (): string => {
  const base = stripTrailingSlashes(API_BASE_URL);
  if (base.endsWith("/api")) {
    return stripTrailingSlashes(base.slice(0, -4));
  }
  return base;
};

const sumAmounts = (entries: any[]): number =>
  entries.reduce((sum, entry) => {
    const amount = Number(entry?.amount ?? 0);
    return Number.isFinite(amount) ? sum + amount : sum;
  }, 0);

const coerceNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const coerceDateString = (value: unknown): string => {
  if (!value) return "";
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const parsed = Date.parse(trimmed);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
    return trimmed;
  }
  return "";
};

const normaliseOutcomeValue = (
  value: unknown
): MarketDataType["outcome"] => {
  if (typeof value !== "string") return undefined;
  const upper = value.toUpperCase();
  if (upper === "PENDING" || upper === "YES" || upper === "NO" || upper === "CANCELLED") {
    return upper as MarketDataType["outcome"];
  }
  return undefined;
};

const normaliseResolutionStatus = (
  value: unknown
): MarketDataType["resolutionStatus"] => {
  if (typeof value !== "string") return undefined;
  const upper = value.toUpperCase();
  if (
    upper === "IDLE" ||
    upper === "PENDING" ||
    upper === "PROCESSING" ||
    upper === "FAILED" ||
    upper === "RESOLVED"
  ) {
    return upper as MarketDataType["resolutionStatus"];
  }
  return undefined;
};

const normaliseMarket = (
  market: Partial<MarketDataType> & Record<string, any>
): MarketDataType => {
  const playerAEntries: BetHistoryEntry[] = Array.isArray(market.playerA)
    ? (market.playerA as BetHistoryEntry[])
    : [];
  const playerBEntries: BetHistoryEntry[] = Array.isArray(market.playerB)
    ? (market.playerB as BetHistoryEntry[])
    : [];

  const derivedPlayerACount = sumAmounts(playerAEntries);
  const derivedPlayerBCount = sumAmounts(playerBEntries);

  const playerACount = coerceNumber(
    market.playerACount,
    derivedPlayerACount
  );
  const playerBCount = coerceNumber(
    market.playerBCount,
    derivedPlayerBCount
  );

  const totalInvestment = coerceNumber(
    market.totalInvestment,
    playerACount + playerBCount
  );

  let onChainId: number | null = null;
  if (typeof market.onChainId === "number" && Number.isFinite(market.onChainId)) {
    onChainId = market.onChainId;
  } else if (typeof market.onChainId === "string") {
    const parsed = Number(market.onChainId);
    onChainId = Number.isFinite(parsed) ? parsed : null;
  }

  const id =
    typeof market._id === "string"
      ? market._id
      : typeof market._id === "object" && market._id !== null
      ? (market._id as any).toString?.() ?? ""
      : "";

  return {
    _id: id,
    marketField: coerceNumber(market.marketField),
    apiType: coerceNumber(market.apiType),
    task: market.task ?? "",
    creator: market.creator ?? "",
    tokenA: market.tokenA ?? "",
    tokenB: market.tokenB ?? "",
    market: market.market ?? "",
    question: market.question ?? "",
    feedName: market.feedName ?? "",
    value: coerceNumber(market.value),
    tradingAmountA: coerceNumber(market.tradingAmountA),
    tradingAmountB: coerceNumber(market.tradingAmountB),
    tokenAPrice: coerceNumber(market.tokenAPrice),
    tokenBPrice: coerceNumber(market.tokenBPrice),
    initAmount: coerceNumber(market.initAmount),
    range: coerceNumber(market.range),
    date: coerceDateString(market.date),
    marketStatus: market.marketStatus ?? "INIT",
    imageUrl: market.imageUrl ?? "",
    createdAt: coerceDateString(market.createdAt),
    updatedAt: coerceDateString((market as any).updatedAt),
    __v: coerceNumber(market.__v),
    playerACount,
    playerBCount,
    totalInvestment,
    description: market.description ?? "",
    comments: coerceNumber(market.comments),
    playerA: playerAEntries,
    playerB: playerBEntries,
    onChainId,
    outcome: normaliseOutcomeValue(market.outcome),
    resolutionStatus: normaliseResolutionStatus(
      (market as any).resolutionStatus ?? market.resolutionStatus
    ),
    resolvedAt: coerceDateString((market as any).resolvedAt),
    resolutionSource:
      typeof (market as any).resolutionSource === "string"
        ? (market as any).resolutionSource
        : undefined,
  };
};

interface GlobalContextType {
  markets: MarketDataType[];
  formatMarketData: (
    data: (Partial<MarketDataType> & Record<string, any>)[]
  ) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [markets, setMarkets] = useState<MarketDataType[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const upsertMarket = useCallback(
    (incoming: Partial<MarketDataType> & Record<string, any>) => {
      const normalised = normaliseMarket(incoming);
      if (!normalised._id) {
        return;
      }
      setMarkets((previous) => {
        const index = previous.findIndex(
          (entry) => entry._id === normalised._id
        );
        if (index === -1) {
          return [normalised, ...previous];
        }
        const clone = [...previous];
        clone[index] = { ...clone[index], ...normalised };
        return clone;
      });
    },
    []
  );

  const formatMarketData = useCallback(
    (data: (Partial<MarketDataType> & Record<string, any>)[]) => {
      const normalised = data.map((market) => normaliseMarket(market));
      setMarkets(normalised);
    },
    []
  );

  useEffect(() => {
    const socketUrl = deriveSocketUrl();
    const socket = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
    });
    socketRef.current = socket;

    const handleMarketUpdate = (market: Partial<MarketDataType>) => {
      upsertMarket(market);
    };

    socket.on("market:update", handleMarketUpdate);

    return () => {
      socket.off("market:update", handleMarketUpdate);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [upsertMarket]);

  return (
    <GlobalContext.Provider value={{ markets, formatMarketData }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
