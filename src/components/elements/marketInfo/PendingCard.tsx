"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { GiAlarmClock } from "react-icons/gi";
import { elipsKey, getCountDown } from "@/utils";
import { motion } from "framer-motion";

// Define types for the props
interface PendingCardProps {
  category: string;
  question: string;
  imageUrl: string;
  volume: number;
  timeLeft: string;
}

const PendingCard: React.FC<PendingCardProps> = ({
  category,
  question,
  imageUrl,
  volume,
  timeLeft,
}) => {
  const [counter, setCounter] = useState("7d : 6h : 21m : 46s");
  const totalStake = Number.isFinite(volume) ? volume : Number(volume ?? 0);

  useEffect(() => {
    const interval = setInterval(() => {
      let remainTime = getCountDown(timeLeft)
      setCounter(remainTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.025, boxShadow: "0 8px 32px 0 rgba(7,179,255,0.10)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full lg:p-6 p-4 bg-[#1a1f26] rounded-2xl border border-[#1f242c] shadow-[0_24px_48px_-36px_rgba(6,12,20,0.65)] flex flex-col justify-start items-start lg:gap-6 gap-4"
    >
      <div className="self-stretch flex flex-col justify-start items-start gap-6">
        <div className="self-stretch flex justify-start items-center gap-2">
          <div className="flex-1 justify-start text-[#FCD535] lg:text-base text-xs font-semibold font-Inter">
            {elipsKey(category)}
          </div>
        </div>
        <div className="self-stretch flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex-1 text-white lg:text-lg text-base font-medium font-rubik leading-relaxed">
            {question}
          </div>
          <div className="flex-shrink-0">
            <img className="lg:w-14 lg:h-14 w-12 h-12 rounded-lg object-cover" src={imageUrl} alt={category} />
          </div>
        </div>
        {/* Market Stats */}
        <div className="self-stretch grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Left: Stake info */}
          <div className="flex flex-col gap-1">
            <div className="text-[#9EA5B5] text-sm font-semibold">Total Stake</div>
            <div className="text-white text-sm font-semibold">{totalStake.toFixed(4)} BNB</div>
          </div>
          {/* Right: Time Remaining */}
          <div className="flex flex-col gap-1 items-start sm:items-end">
            <div className="text-[#9EA5B5] text-sm font-semibold">Time Remaining</div>
            <div className="text-[#FCD535] text-sm font-semibold flex items-center gap-1 flex-wrap">
              <GiAlarmClock className="text-[#FCD535]" />
              {counter}
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch mt-4 rounded-2xl border border-dashed border-[#3fa9f5] bg-[#182c3a]/30 px-4 py-3 text-sm font-medium text-[#3fa9f5] text-center">
        Awaiting activation – once approved this market moves to the live tab.
      </div>
    </motion.div>
  );
};

export default PendingCard;




