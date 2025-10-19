import { getCountDown } from "@/utils";
import React, { useEffect, useState } from "react";
import { GiAlarmClock } from "react-icons/gi";

interface ProfileProposeItemProps {
  image: string;
  title: string;
  status: "Pending" | "Active" | "Expired";
  timeLeft: string;
  betAmount: number;
  totalAmount: number;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-[#FCD535]/10 text-[#FCD535]",
  ACTIVE: "bg-[#FCD535]/10 text-[#FCD535]",
  Expired: "bg-[#ff6464]/10 text-[#ff6464]",
};

const ProfileProposeItem = (param: any) => {
  const [counter, setCounter] = useState("7d : 6h : 21m : 46s");
  const [fund, setFund] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      let remainTime = getCountDown(param.date)
      setCounter(remainTime);
    }, 1000);
    const totalAmount = param.investors.reduce((sum:any, i:any) => sum + i.amount, 0);
    setFund(totalAmount);
    return () => clearInterval(interval);
  }, [])
  return (
    <div className="self-stretch p-6 bg-[#1a1f26] rounded-2xl border border-[#1f242c] flex flex-col sm:flex-row justify-start items-start gap-6">
      <img className="w-12 h-12 rounded-lg" src={param.imageUrl} alt="proposal-icon" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="text-[#FCD535] text-base font-semibold font-interSemi leading-normal">{param.marketStatus}</div>
        </div>
        <div className="text-white text-lg font-medium font-satoshi leading-relaxed mb-2">{param.question}</div>
        <div className="flex flex-col gap-2">
          <div className="text-[#9EA5B5] text-sm font-normal font-interSemi leading-tight">Time Left</div>
          <div className="px-2 py-1 bg-[#9EA5B5]/20 rounded-xl flex items-center gap-2 w-fit">
            <div className="w-4 h-4 relative overflow-hidden">
              <GiAlarmClock size={16} className="text-gray" />
            </div>
            <div className="text-[#9EA5B5] text-xs font-medium font-satoshi leading-[18px]">{counter}</div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <div className="text-[#9EA5B5] text-sm font-normal font-interSemi leading-tight">Collected</div>
          <div className="w-[180px] sm:w-[220px] h-[18px] flex justify-between items-center mx-0 my-1">
            {Array.from({ length: 20 }).map((_, idx) => {
              const filledSegments = Math.floor((fund / 0.1) * 20);
              const isFilled = idx < filledSegments;
              return (
                <div
                  key={idx}
                  className={`sm:w-[11px] w-[7px] h-[14px] self-stretch ${isFilled ? 'bg-[#FCD535]' : 'bg-[#9EA5B5]'} rounded-[100px] animate-pulse [animation-delay:${idx * 100}ms]`}
                />
              );
            })}
          </div>
          <div className="w-[180px] sm:w-[220px] flex justify-between items-center mx-0 mt-1">
            <span className="text-[#FCD535] text-sm font-semibold font-interSemi leading-relaxed">
              {fund}
            </span>
            <span className="text-[#9EA5B5] text-sm font-semibold font-interSemi leading-relaxed">
              / {0.1} BNB
            </span>
            <span className="text-right text-white text-sm font-semibold font-interSemi leading-relaxed ml-auto">
              BNB Raised
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileProposeItem;





