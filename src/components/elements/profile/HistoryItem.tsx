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
  return (
    <div className="self-stretch p-4 bg-[#1a1f26] rounded-2xl border border-[#1f242c] inline-flex justify-start items-center gap-3">
      <img className="w-8 h-8 rounded-lg" src={param.imageUrl} alt="Market Icon" />
      <div className="flex-1 justify-center text-white text-sm font-medium font-satoshi leading-relaxed w-1/4">
        {param.question}
      </div>
      <div className="w-[100px] rounded-[100px] inline-flex flex-col justify-center items-start">
        <div
          className={`px-2.5 ${statusColors["Ongoing"]} rounded-[100px] inline-flex justify-center items-center gap-2.5`}
        >
          <div className="justify-start text-sm font-medium font-satoshi leading-normal">
            {param.marketStatus}
          </div>
        </div>
      </div>
      <div className="w-[100px] flex justify-start center items-center gap-1">
        <div className="justify-start text-[#9EA5B5] text-sm font-medium font-satoshi leading-relaxed">
          {percentage.toFixed(1)} %
        </div>
        <div
          className={`w-[30px] justify-start ${answerColor} text-sm font-medium font-satoshi leading-relaxed`}
        >
          {answer}
        </div>
      </div>
      <div className="w-[100px] justify-start text-white text-sm font-medium font-['Inter'] leading-relaxed">
        {amount}
      </div>
    </div>
  );
};

export default HistoryItem;





