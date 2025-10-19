import { useMemo } from "react";

import RecentItem from "./RecentItem";
import { useGlobalContext } from "@/providers/GlobalContext";
import { formatTokenAmount, shortenAddress, timeAgo } from "@/utils";

type RecentStatus = "yes" | "no" | "funded";

const statusFromMarketState = (status?: string): RecentStatus => {
  const normalized = status?.toUpperCase() ?? "PENDING";
  if (normalized.includes("YES")) return "yes";
  if (normalized.includes("NO")) return "no";
  if (normalized.includes("CLOSE") || normalized.includes("SETTLE")) return "funded";
  return "funded";
};

const RecentList: React.FC = () => {
  const { markets } = useGlobalContext();

  const recentItems = useMemo(() => {
    if (!markets.length) return [];

    return [...markets]
      .filter((market) => market.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      )
      .slice(0, 8)
      .map((market) => ({
        question: market.question ?? "Prediction market",
        timeAgo: market.createdAt ? timeAgo(new Date(market.createdAt).getTime()) : "—",
        userName: shortenAddress(market.creator ?? "", 4),
        action: market.marketStatus?.toLowerCase() ?? "updated",
        price: formatTokenAmount(market.totalInvestment),
        imageSrc: market.imageUrl || "https://placehold.co/40x40/0b0e11/FFFFFF?text=BNB",
        status: statusFromMarketState(market.marketStatus),
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
      {recentItems.map((item, index) => (
        <RecentItem key={`${item.userName}-${index}`} {...item} />
      ))}
    </div>
  );
};

export default RecentList;
