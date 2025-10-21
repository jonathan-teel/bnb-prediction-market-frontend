"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MarketStatus } from "@/types/type";
// Define ActiveTab type
type BetEntry = {
  player: string;
  amount: number;
  timestamp?: string;
};

type MarketDataType = {
  "_id": string,
  "marketField": number,
  "apiType": number,
  "task": string,
  "creator": string,
  "tokenA": string,
  "tokenB": string,
  "market": string,
  "question": string,
  "feedName": string,
  "value": number,
  "tradingAmountA": number,
  "tradingAmountB": number,
  "tokenAPrice": number,
  "tokenBPrice": number,
  "initAmount": number,
  "range": number,
  "date": string,
  "marketStatus": string,
  "imageUrl": string,
  "createdAt": string,
  "__v": number,
  "playerACount": number,
  "playerBCount": number,
  "totalInvestment": number,
  "description": string,
  "comments": number,
  "playerA": BetEntry[],
  "playerB": BetEntry[],
  "onChainId": number | null
}

const normalizeMarket = (market: Partial<MarketDataType> & Record<string, any>): MarketDataType => ({
  _id: market._id ?? "",
  marketField: market.marketField ?? 0,
  apiType: market.apiType ?? 0,
  task: market.task ?? "",
  creator: market.creator ?? "",
  tokenA: market.tokenA ?? "",
  tokenB: market.tokenB ?? "",
  market: market.market ?? "",
  question: market.question ?? "",
  feedName: market.feedName ?? "",
  value: market.value ?? 0,
  tradingAmountA: market.tradingAmountA ?? 0,
  tradingAmountB: market.tradingAmountB ?? 0,
  tokenAPrice: market.tokenAPrice ?? 0,
  tokenBPrice: market.tokenBPrice ?? 0,
  initAmount: market.initAmount ?? 0,
  range: market.range ?? 0,
  date: market.date ?? "",
  marketStatus: market.marketStatus ?? "INIT",
  imageUrl: market.imageUrl ?? "",
  createdAt: market.createdAt ?? "",
  __v: market.__v ?? 0,
  playerACount: market.playerACount ?? 0,
  playerBCount: market.playerBCount ?? 0,
  totalInvestment: market.totalInvestment ?? 0,
  description: market.description ?? "",
  comments: market.comments ?? 0,
  playerA: Array.isArray(market.playerA) ? market.playerA : [],
  playerB: Array.isArray(market.playerB) ? market.playerB : [],
  onChainId: typeof market.onChainId === "number" ? market.onChainId : (typeof market.onChainId === "string" ? Number(market.onChainId) : null),
});

// Define Global Context Type
interface GlobalContextType {
  activeTab: MarketStatus;
  markets: MarketDataType[];
  setActiveTab: (tab: MarketStatus) => void;
  formatMarketData: (data: (Partial<MarketDataType> & Record<string, any>)[]) => void;
}

// Create Context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Create Global Provider
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<MarketStatus>("ACTIVE");
  const [markets, setMarkets] = useState<MarketDataType[]>([]);

  const formatMarketData = (data: (Partial<MarketDataType> & Record<string, any>)[]) => {
    const normalized = data.map((market) => normalizeMarket(market));
    setMarkets(normalized);
  }

  return (
    <GlobalContext.Provider value={{ activeTab, markets, setActiveTab, formatMarketData }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom Hook to use Global Context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

