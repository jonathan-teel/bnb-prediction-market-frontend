"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Icon from "../Icons";
import { GiAlarmClock } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { elipsKey, getCountDown } from "@/utils";
import { motion } from "framer-motion";

// Define types for the props
interface PendingCardProps {
  category: string;
  question: string;
  imageUrl: string;
  volume: number;
  timeLeft: string;
  index: number;
}

const PendingCard: React.FC<PendingCardProps> = ({
  index,
  category,
  question,
  imageUrl,
  volume,
  timeLeft,
}) => {
  const router = useRouter();
  const [counter, setCounter] = useState("7d : 6h : 21m : 46s");

  useEffect(() => {
    const interval = setInterval(() => {
      let remainTime = getCountDown(timeLeft)
      setCounter(remainTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDetailClick = (index: number) => {
    const formattedQuestion = encodeURIComponent(question);
    router.push(`/fund/${index}`);
  };

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
          {/* Left: Funding info */}
          <div className="flex flex-col gap-1">
            <div className="text-[#9EA5B5] text-sm font-semibold">Funding</div>
            <div className="text-white text-sm font-semibold">{volume.toFixed(4)} / 0.001 BNB</div>
            <div className="text-[#9EA5B5] text-xs font-semibold"></div>
          </div>
          {/* Right: Time Remaining and Progress Bar */}
          <div className="flex flex-col gap-1 items-start sm:items-end">
            <div className="text-[#9EA5B5] text-sm font-semibold">Time Remaining</div>
            <div className="text-[#FCD535] text-sm font-semibold flex items-center gap-1 flex-wrap">
              <GiAlarmClock className="text-[#FCD535]" />
              {counter}
            </div>
            {/* Progress Bar (fills container, 20 blocks, even spacing, visible unfilled) */}
            <div className="mt-2 flex items-center gap-2 w-full max-w-[220px]">
              {/* Percentage (clamped to 100%) */}
              <span className="text-[#FCD535] text-xs font-semibold min-w-[38px] text-right">
                {Math.min(100, Math.floor((volume / 0.001) * 100))}%
              </span>
              <div className="flex-1 flex items-center gap-[3px] h-[12px]">
                {Array.from({ length: 20 }).map((_, index) => {
                  const percent = Math.min(1, volume / 0.001);
                  const filledSegments = Math.round(percent * 20);
                  const isFilled = index < filledSegments;
                  // Determine color for all filled blocks based on overall percent
                  let fillColor = '#555555';
                  if (isFilled) {
                    if (percent <= 0.33) fillColor = '#ff6464'; // orange
                    else if (percent <= 0.69) fillColor = '#ffd600'; // yellow
                    else fillColor = '#FCD535'; // green
                  }
                  return (
                    <div
                      key={index}
                      className={`h-full w-full max-w-[7px] rounded-[2px] animate-pulse`}
                      style={{ background: fillColor, animationDelay: `${index * 100}ms` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fund Button */}
      <button
        className="self-stretch px-4 py-2.5 bg-[#182c3a] outline outline-[#3fa9f5] rounded-2xl cursor-pointer hover:bg-[#20405a] transition-all duration-200 flex justify-center items-center gap-2 mt-4"
        onClick={() => handleDetailClick(index)}
      >
        <span className="w-5 h-5 flex items-center justify-center">
          <Icon name="FundMarket" color="#3fa9f5" />
        </span>
        <span className="text-[#3fa9f5] text-lg font-bold font-satoshi leading-7">Fund now</span>
      </button>
    </motion.div>
  );
};

export default PendingCard;




