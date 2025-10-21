import { useMemo } from "react";

import RecentItem from "./RecentItem";
import { useGlobalContext } from "@/providers/GlobalContext";
import { formatTokenAmount, shortenAddress, timeAgo } from "@/utils";
import type { BetHistoryEntry, MarketDataType } from "@/types/type";

type RecentStatus = "yes" | "no" | "funded";

type RawEvent = {
  timestamp: number;
  action: string;
  status: RecentStatus;
  price: string;
  address: string;
  question: string;
  imageSrc: string;
};

const parseTimestamp = (value: unknown): number | null => {
  if (!value) return null;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Date.parse(trimmed);
    if (!Number.isNaN(parsed)) return parsed;
    const numeric = Number(trimmed);
    if (Number.isFinite(numeric)) return numeric;
  }
  return null;
};

const extractLatestBetEvent = (
  entries: BetHistoryEntry[] | undefined,
  isYes: boolean
): { timestamp: number; amount: number; isYes: boolean; player?: string } | null => {
  if (!Array.isArray(entries) || entries.length === 0) return null;
  let latest: { timestamp: number; amount: number; isYes: boolean; player?: string } | null = null;

  entries.forEach((entry) => {
    const ts = parseTimestamp(entry?.timestamp);
    const amount = Number(entry?.amount ?? 0);
    if (ts !== null && Number.isFinite(amount)) {
      if (!latest || ts > latest.timestamp) {
        latest = { timestamp: ts, amount, isYes, player: entry?.player };
      }
    }
  });

  return latest;
};

const statusFromOutcome = (
  marketStatus?: string,
  outcome?: string,
  fallback: RecentStatus = "funded"
): RecentStatus => {
  const normalizedOutcome = outcome?.toUpperCase();
  if (normalizedOutcome === "YES") return "yes";
  if (normalizedOutcome === "NO") return "no";

  const normalizedStatus = marketStatus?.toUpperCase();
  if (normalizedStatus === "CANCELLED") return "funded";
  if (normalizedStatus?.includes("YES")) return "yes";
  if (normalizedStatus?.includes("NO")) return "no";

  return fallback;
};

const RecentList: React.FC = () => {
  const { markets } = useGlobalContext();

  const recentItems = useMemo(() => {
    if (!markets.length) return [];

    const events: RawEvent[] = [];

    markets.forEach((market: MarketDataType & Record<string, any>) => {
      const question = market.question ?? "Prediction market";
      const imageSrc =
        market.imageUrl || "https://placehold.co/40x40/0b0e11/FFFFFF?text=BNB";
      const defaultAddress = market.creator ?? "";
      const totalInvestmentDisplay = formatTokenAmount(market.totalInvestment);

      const createdTs = parseTimestamp(market.createdAt);
      const updatedTs = parseTimestamp(
        market.updatedAt ?? (market as any)?.updatedAt
      );
      const resolvedTs = parseTimestamp(
        market.resolvedAt ?? (market as any)?.resolvedAt
      );

      const latestYesBet = extractLatestBetEvent(market.playerA, true);
      if (latestYesBet) {
        const amountAbs = Math.abs(latestYesBet.amount);
        const isWithdrawal = latestYesBet.amount < 0;
        events.push({
          timestamp: latestYesBet.timestamp,
          action: isWithdrawal ? "Withdrew YES" : "Bet YES",
          status: "yes",
          price: formatTokenAmount(amountAbs),
          address: latestYesBet.player ?? defaultAddress,
          question,
          imageSrc,
        });
      }

      const latestNoBet = extractLatestBetEvent(market.playerB, false);
      if (latestNoBet) {
        const amountAbs = Math.abs(latestNoBet.amount);
        const isWithdrawal = latestNoBet.amount < 0;
        events.push({
          timestamp: latestNoBet.timestamp,
          action: isWithdrawal ? "Withdrew NO" : "Bet NO",
          status: "no",
          price: formatTokenAmount(amountAbs),
          address: latestNoBet.player ?? defaultAddress,
          question,
          imageSrc,
        });
      }

      if (resolvedTs !== null && market.outcome) {
        events.push({
          timestamp: resolvedTs,
          action: `Resolved ${market.outcome.toLowerCase()}`,
          status: statusFromOutcome(market.marketStatus, market.outcome),
          price: totalInvestmentDisplay,
          address: defaultAddress,
          question,
          imageSrc,
        });
      }

      if (updatedTs !== null) {
        events.push({
          timestamp: updatedTs,
          action: "Updated market",
          status: statusFromOutcome(market.marketStatus, market.outcome),
          price: totalInvestmentDisplay,
          address: defaultAddress,
          question,
          imageSrc,
        });
      }

      if (createdTs !== null) {
        events.push({
          timestamp: createdTs,
          action: "Created market",
          status: "funded",
          price: totalInvestmentDisplay,
          address: defaultAddress,
          question,
          imageSrc,
        });
      }
    });

    return events
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map((event) => ({
        question: event.question,
        timeAgo: timeAgo(event.timestamp),
        userName: shortenAddress(event.address ?? "", 4),
        action: event.action,
        price: event.price,
        imageSrc: event.imageSrc,
        status: event.status,
        activityTimestamp: event.timestamp,
      }));
  }, [markets]);

  if (!recentItems.length) {
    return (
      <div className="self-stretch rounded-2xl border border-[#1f242c] bg-[#11161c] p-6 text-center text-sm text-[#9EA5B5]">
        Activity will appear here as soon as the first market is created.
      </div>
    );
  }

  return (
    <div className="self-stretch rounded-2xl flex flex-col justify-start items-start gap-2">
      {recentItems.map((item) => (
        <RecentItem
          key={`${item.userName}-${item.activityTimestamp}`}
          question={item.question}
          timeAgo={item.timeAgo}
          userName={item.userName}
          action={item.action}
          price={item.price}
          imageSrc={item.imageSrc}
          status={item.status}
        />
      ))}
    </div>
  );
};

export default RecentList;

