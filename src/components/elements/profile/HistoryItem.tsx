"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "@/providers/WalletProvider";

interface HistoryItemProps {
  imageUrl: string;
  question: string;
  status: "Ongoing" | "Won" | "Lost";
  percentage: string;
  answer: "Yes" | "No";
  amount: string;
}

const HistoryItem = (param: any) => {
  const { address } = useWallet();
  const [percentage, setPercentage] = useState(0);
  const [answer, setAnswer] = useState("Yes");
  const [amount, setAmount] = useState("Yes");
  // Define status colors dynamically
  const statusColors = {
    Ongoing: "bg-[#FCD535]/10 text-[#FCD535]",
    Won: "bg-[#FCD535]/10 text-[#FCD535]",
    Lost: "bg-[#ff6464]/10 text-[#ff6464]",
  };
  
  // const answerColor = answer === "Yes" ? "text-[#FCD535]" : "text-[#ff6464]";
  const answerColor = "text-[#ff6464]";
  useEffect(() => {
    if (!address || !Array.isArray(param.playerA) || !Array.isArray(param.playerB)) {
      setAmount("0");
      setPercentage(0);
      return;
    }

    let playerList = param.playerA.find((p: any) => p.player?.toLowerCase() === address.toLowerCase());
    let totalPlayAmount = 0;

    if (playerList) {
      totalPlayAmount = param.playerA.reduce((sum: number, i: any) => sum + i.amount, 0);
    } else {
      playerList = param.playerB.find((p: any) => p.player?.toLowerCase() === address.toLowerCase());
      totalPlayAmount = param.playerB.reduce((sum: number, i: any) => sum + i.amount, 0);
      setAnswer("No");
    }

    if (!playerList || totalPlayAmount === 0) {
      setAmount("0");
      setPercentage(0);
      return;
    }

    const pct = (playerList.amount / totalPlayAmount) * 100;
    setAmount(playerList.amount);
    setPercentage(pct);
  }, [address, param.playerA, param.playerB]);
  const statusClass = statusColors[param.marketStatus as keyof typeof statusColors] ?? statusColors.Ongoing;

  return (
    <div className="self-stretch w-full p-4 bg-[#1a1f26] rounded-2xl border border-[#1f242c] flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex w-full items-start gap-3 sm:flex-1">
        <img className="w-10 h-10 rounded-lg object-cover" src={param.imageUrl} alt="Market Icon" />
        <div className="flex-1 text-white text-sm font-medium font-satoshi leading-relaxed">
          {param.question}
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end">
        <div className="rounded-[100px]">
          <div className={`px-3 py-1.5 ${statusClass} rounded-[100px] flex items-center justify-center gap-2`}>
            <div className="text-sm font-medium font-satoshi leading-normal">
              {param.marketStatus}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium font-satoshi leading-relaxed">
          <span className="text-[#9EA5B5]">{percentage.toFixed(1)}%</span>
          <span className={answerColor}>{answer}</span>
        </div>
        <div className="text-white text-sm font-medium font-['Inter'] leading-relaxed">
          {amount}
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;





