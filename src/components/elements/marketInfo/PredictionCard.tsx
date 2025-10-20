"use client";

import React, { useEffect } from "react";
import { FaRegClock, FaRegStar } from "react-icons/fa6";
import Icon from "../Icons";
import ProgressBar from "./ProgressBar";
import { useState } from "react";
import { elipsKey, getCountDown, shortenAddress } from "@/utils";
import { useGlobalContext } from "@/providers/GlobalContext";
import { marketBetting } from "@/components/prediction_market_sdk";
import { errorAlert, infoAlert } from "../ToastGroup";
import axios from "axios";
import { MarketDataType } from "@/types/type";
import { motion } from "framer-motion";
import { useWallet } from "@/providers/WalletProvider";
import { API_BASE_URL } from "@/config/api";

// Define types for the props
interface PredictionCardProps {
  index: number,
  currentPage: number
}

const PredictionCard: React.FC<PredictionCardProps> = ({
  index,
  currentPage
}) => {
  const { markets, formatMarketData } = useGlobalContext(); // Use Global Context
  const { address, connected } = useWallet();
  const [counter, setCounter] = useState("7d : 6h : 21m : 46s");
  useEffect(() => {
    const interval = setInterval(() => {
      let remainTime: string = getCountDown(markets[index].date);
      setCounter(remainTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  const onVote = async (isYes: boolean) => {
    try {
      if (!connected || !address) {
        errorAlert("Please connect your wallet before placing a bet.");
        return;
      }

      const stakeAmount = 1; // BNB amount staked (can be adjusted or made dynamic)

      const marketIdentifier =
        (markets[index] as any)?.onChainId ??
        (markets[index] as any)?.marketId ??
        (Number.isFinite(index) ? index + 1 : undefined);

      if (marketIdentifier === undefined || marketIdentifier === null) {
        errorAlert("Unable to resolve on-chain market identifier.");
        return;
      }

      const txResult = await marketBetting({
        marketId: marketIdentifier,
        outcome: isYes ? "YES" : "NO",
        amount: stakeAmount,
      });

      infoAlert(`Bet placed! Tx: ${shortenAddress(txResult.hash)}`);

      try {
        await axios.post(`${API_BASE_URL}/market/betting`, {
          player: address,
          market_id: markets[index]._id,
          onChainId: marketIdentifier,
          amount: stakeAmount,
          isYes,
          currentPage,
          signature: txResult.hash,
          signedMessage: txResult.hash,
          txHash: txResult.hash,
          chainId: txResult.chainId,
        });
        const fieldQuery = markets[index]?.marketField ?? 0;
        const marketData = await axios.get(
          `${API_BASE_URL}/market/get?page=${currentPage}&limit=10&marketStatus=ACTIVE&marketField=${fieldQuery}`
        );
        formatMarketData(marketData.data.data as MarketDataType[]);
      } catch (apiError) {
        console.warn("Betting API sync failed:", apiError);
      }
    } catch (error) {
      console.log(error);
      errorAlert("Betting transaction failed.");
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.025, boxShadow: "0 8px 32px 0 rgba(7,179,255,0.10)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full lg:p-6 p-4 bg-[#1a1f26] rounded-2xl border border-[#1f242c] shadow-[0_24px_48px_-36px_rgba(6,12,20,0.65)] flex flex-col justify-start items-start lg:gap-6 gap-4"
    >
      <div className="self-stretch flex flex-col justify-start items-start gap-2">
        <div className="self-stretch flex justify-between items-center gap-2">
          <div className="flex-1 justify-start text-[#FCD535] lg:text-base text-xs font-semibold font-Inter leading-normal">
            {elipsKey(markets[index].feedName)}
          </div>
          <div className="lg:w-5 lg:h-5 w-4 h-4 relative overflow-hidden">
            <FaRegStar className="text-white" />
          </div>
        </div>
        <div className="self-stretch flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex-1 text-white lg:text-2xl text-lg font-medium font-rubik">
            {markets[index].question}
          </div>
          <div className="flex-shrink-0">
            <img
              className="lg:w-14 lg:h-14 w-12 h-12 rounded-lg object-cover"
              src={markets[index].imageUrl}
              alt={markets[index].feedName}
            />
          </div>
        </div>
        
        {/* Market Stats */}
        <div className="self-stretch grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <div className="text-[#9EA5B5] text-sm font-semibold">Volume</div>
            <div className="text-white text-sm font-semibold">{markets[index].totalInvestment} BNB</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[#9EA5B5] text-sm font-semibold">Time Remaining</div>
            <div className="text-[#FCD535] text-sm font-semibold flex items-center gap-1">
              <FaRegClock className="text-[#FCD535]" />
              {counter}
            </div>
          </div>
        </div>

        {/* Percent Chance Bar */}
        <div className="self-stretch flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="text-[#9EA5B5] text-sm font-semibold">Percent Chance</div>
            <div className="text-white text-sm font-semibold">
              {Math.floor(markets[index].playerACount / (markets[index].playerACount + markets[index].playerBCount) * 100)}%
            </div>
          </div>
          <ProgressBar yesPercentage={(markets[index].playerACount + markets[index].playerBCount) === 0 ? 50 : Math.floor(markets[index].playerACount / (markets[index].playerACount + markets[index].playerBCount) * 100)} />
        </div>
      </div>

      {/* Yes/No Buttons */}
      <div className="self-stretch flex flex-col sm:flex-row justify-start items-stretch gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:flex-1 px-4 py-2.5 bg-[#223a25] outline outline-[#FCD535] rounded-2xl cursor-pointer transition-all duration-200 flex justify-center items-center gap-2"
          onClick={() => onVote(true)}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <Icon name="yes" color="#FCD535" />
          </span>
          <span className="text-[#FCD535] text-lg font-bold font-satoshi leading-7">Yes</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:flex-1 px-4 py-2.5 bg-[#3a2222] outline outline-[#ff6464] rounded-2xl cursor-pointer transition-all duration-200 flex justify-center items-center gap-2"
          onClick={() => onVote(false)}
        >
          <span className="w-5 h-5 flex items-center justify-center">
            <Icon name="no" color="#ff6464" />
          </span>
          <span className="text-[#ff6464] text-lg font-bold font-satoshi leading-7">No</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PredictionCard;



