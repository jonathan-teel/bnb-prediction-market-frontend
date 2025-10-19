import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

type BnbCounterProps = {
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  amount: number;
};

const BnbCounter = ({ setAmount, amount }: BnbCounterProps) => {
  const increaseBnb = () => setAmount((prev) => prev + 1);
  const decreaseBnb = () => {
    if (amount > 0) {
      setAmount((prev) => Math.max(prev - 1, 0));
    }
  };

  const changeBalance = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setAmount(newValue);
    } else {
      setAmount(0); // fallback for empty input
    }
  }
  return (
    <div className="self-stretch p-2 bg-[#0b0e11] rounded-xl shadow-[inset_0px_2px_0px_0px_rgba(0,0,0,0.20)] border border-[#1f242c] inline-flex justify-start items-center gap-3">
      {/* Decrease Button */}
      <div
        onClick={amount > 0 ? decreaseBnb : undefined}
        className={` self-stretch p-3 bg-[#1a1f26] rounded-xl flex justify-center items-center gap-1.5 cursor-pointer transition-all duration-300 
          ${amount > 0 ? "hover:bg-[#242a31] active:scale-95" : "opacity-50 cursor-not-allowed"}`}
      >
        <FaMinus className="text-white" />
      </div>

      {/* BNB Amount Display */}
      <div className="flex-1 rounded-lg flex justify-center items-center gap-2">
        <input type="number" className="justify-start text-[#9EA5B5] text-xl text-center font-medium font-satoshi leading-tight outline-none" value={amount} onChange={changeBalance} />
      </div>

      {/* Increase Button */}
      <div
        onClick={increaseBnb}
        className="self-stretch p-3 bg-[#1a1f26] rounded-xl shadow-[inset_-2px_-2px_6px_0px_rgba(0,0,0,0.20)] flex justify-center items-center gap-1.5 cursor-pointer transition-all duration-300 hover:bg-[#242a31] active:scale-95"
      >
        <FaPlus className="text-white" />
      </div>
    </div>
  );
};

export default BnbCounter;



