"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaRegClock, FaRegStar } from "react-icons/fa6";
import Icon from "../Icons";
import ProgressBar from "./ProgressBar";
import { elipsKey, getCountDown, shortenAddress } from "@/utils";
import { useGlobalContext } from "@/providers/GlobalContext";
import { getUserPosition, marketBetting, marketWithdraw } from "@/components/prediction_market_sdk";
import { errorAlert, infoAlert } from "../ToastGroup";
import axios from "axios";
import { MarketDataType } from "@/types/type";
import { motion } from "framer-motion";
import { useWallet } from "@/providers/WalletProvider";
import { API_BASE_URL } from "@/config/api";
import PriceSparkline from "./PriceSparkline";

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
  const [stakeAmount, setStakeAmount] = useState<string>("0.10");
  const [isBetting, setIsBetting] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [sellYesAmount, setSellYesAmount] = useState<string>("0.00");
  const [sellNoAmount, setSellNoAmount] = useState<string>("0.00");
  const [userPosition, setUserPosition] = useState<{ yes: number; no: number }>({
    yes: 0,
    no: 0,
  });

  const market = markets[index] as MarketDataType;
  if (!market) {
    return null;
  }
  const marketIdentifier = useMemo(() => {
    if (!market) {
      return undefined;
    }
    if (typeof market.onChainId === "number" && Number.isFinite(market.onChainId)) {
      return market.onChainId;
    }
    const legacyId = (market as any)?.marketId;
    if (legacyId !== undefined && legacyId !== null) {
      return legacyId;
    }
    return Number.isFinite(index) ? index + 1 : undefined;
  }, [market, index]);

  const totalVolumeDisplay = Math.max(
    0,
    Number(
      market?.totalInvestment ??
        (market.playerACount ?? 0) + (market.playerBCount ?? 0)
    )
  );
  const rawYes = Number(market.playerACount ?? 0);
  const rawNo = Number(market.playerBCount ?? 0);
  const totalYes = rawYes < 0 ? 0 : rawYes;
  const totalNo = rawNo < 0 ? 0 : rawNo;
  const baseProbability =
    totalYes + totalNo > 0
      ? Number(((totalYes / (totalYes + totalNo)) * 100).toFixed(2))
      : 50;

  const yesPercentageDisplay =
    totalYes + totalNo === 0
      ? 50
      : Math.floor((totalYes / (totalYes + totalNo)) * 100);

  const priceSeries = useMemo(() => {
    const entries: { timestamp: number; isYes: boolean; amount: number }[] = [];

    const yesBets = Array.isArray(market.playerA) ? market.playerA : [];
    const noBets = Array.isArray(market.playerB) ? market.playerB : [];

    yesBets.forEach((bet, idx) => {
      entries.push({
        timestamp: bet?.timestamp
          ? new Date(bet.timestamp).getTime()
          : idx + 1,
        isYes: true,
        amount: Number(bet?.amount ?? 0),
      });
    });

    noBets.forEach((bet, idx) => {
      entries.push({
        timestamp: bet?.timestamp
          ? new Date(bet.timestamp).getTime()
          : yesBets.length + idx + 1,
        isYes: false,
        amount: Number(bet?.amount ?? 0),
      });
    });

    entries.sort((a, b) => a.timestamp - b.timestamp);

    let yesTotal = 0;
    let noTotal = 0;
    const series: number[] = [];

    entries.forEach((entry) => {
      if (!Number.isFinite(entry.amount) || entry.amount === 0) {
        return;
      }
      if (entry.isYes) {
        yesTotal += entry.amount;
        if (yesTotal < 0) {
          yesTotal = 0;
        }
      } else {
        noTotal += entry.amount;
        if (noTotal < 0) {
          noTotal = 0;
        }
      }
      const total = yesTotal + noTotal;
      const percent =
        total > 0
          ? Number(((yesTotal / total) * 100).toFixed(2))
          : baseProbability;
      series.push(percent);
    });

    if (!series.length) {
      return [baseProbability];
    }
    return series;
  }, [market, baseProbability]);

  const currentProbability =
    priceSeries[priceSeries.length - 1] ?? baseProbability;

  const refreshUserPosition = useCallback(async () => {
    if (!connected || !address || marketIdentifier === undefined) {
      setUserPosition({ yes: 0, no: 0 });
      return;
    }
    try {
      const position = await getUserPosition({ marketId: marketIdentifier });
      setUserPosition(position);
    } catch (positionError) {
      console.warn("Failed to fetch user position:", positionError);
    }
  }, [connected, address, marketIdentifier]);

  useEffect(() => {
    if (!market?.date) {
      setCounter("0d : 0h : 0m : 0s");
      return;
    }
    const updateCounter = () => {
      const remainTime: string = getCountDown(market.date);
      setCounter(remainTime);
    };
    updateCounter();
    const interval = setInterval(updateCounter, 1000);

    return () => clearInterval(interval);
  }, [market?.date]);

  useEffect(() => {
    void refreshUserPosition();
  }, [refreshUserPosition]);

  const onVote = async (isYes: boolean) => {
    try {
      if (isBetting) {
        return;
      }
      if (!connected || !address) {
        errorAlert("Please connect your wallet before placing a bet.");
        return;
      }

      const amount = Number(stakeAmount);
      if (!Number.isFinite(amount) || amount <= 0) {
        errorAlert("Enter a valid stake amount greater than zero.");
        return;
      }

      setIsBetting(true);

      if (marketIdentifier === undefined || marketIdentifier === null) {
        errorAlert("Unable to resolve on-chain market identifier.");
        return;
      }

      console.debug("placeBet", {
        marketIdentifier,
        amount,
        onChainId: market.onChainId,
        marketIndex: index,
      });
      const txResult = await marketBetting({
        marketId: marketIdentifier,
        outcome: isYes ? "YES" : "NO",
        amount,
      });

      infoAlert(
        `Bet placed! Tx: ${shortenAddress(txResult.hash)}`,
        txResult.explorerUrl
      );

      try {
        await axios.post(`${API_BASE_URL}/market/betting`, {
          player: address,
          market_id: market._id,
          onChainId: marketIdentifier,
          amount,
          isYes,
          currentPage,
          signature: txResult.hash,
          signedMessage: txResult.hash,
          txHash: txResult.hash,
          chainId: txResult.chainId,
        });
        const fieldQuery = market?.marketField ?? 0;
        const marketData = await axios.get(
          `${API_BASE_URL}/market/get?page=${currentPage}&limit=10&marketStatus=ACTIVE&marketField=${fieldQuery}`
        );
        formatMarketData(marketData.data.data as MarketDataType[]);
        await refreshUserPosition();
      } catch (apiError) {
        console.warn("Betting API sync failed:", apiError);
        errorAlert("Bet placed on-chain, but backend sync failed.");
      }
    } catch (error: any) {
      console.error("betting error:", error);
      const rawMessage =
        error?.info?.error?.message ??
        error?.shortMessage ??
        error?.message;
      if (typeof rawMessage === "string" && rawMessage.length > 0) {
        errorAlert(rawMessage);
      } else {
        errorAlert("Betting transaction failed.");
      }
    } finally {
      setIsBetting(false);
    }
  }

  const onSell = async (isYes: boolean) => {
    try {
      if (isSelling) {
        return;
      }
      if (!connected || !address) {
        errorAlert("Please connect your wallet before selling a position.");
        return;
      }
      const amountInput = isYes ? sellYesAmount : sellNoAmount;
      const amount = Number(amountInput);
      if (!Number.isFinite(amount) || amount <= 0) {
        errorAlert("Enter a valid sell amount greater than zero.");
        return;
      }
      const available = isYes ? userPosition.yes : userPosition.no;
      if (amount > available + 1e-9) {
        errorAlert("Sell amount exceeds your available position.");
        return;
      }
      if (marketIdentifier === undefined || marketIdentifier === null) {
        errorAlert("Unable to resolve on-chain market identifier.");
        return;
      }

      setIsSelling(true);
      const txResult = await marketWithdraw({
        marketId: marketIdentifier,
        outcome: isYes ? "YES" : "NO",
        amount,
      });

      infoAlert(
        `Position sold! Tx: ${shortenAddress(txResult.hash)}`,
        txResult.explorerUrl
      );

      try {
        await axios.post(`${API_BASE_URL}/market/withdraw`, {
          player: address,
          market_id: market._id,
          onChainId: marketIdentifier,
          amount,
          isYes,
          txHash: txResult.hash,
          chainId: txResult.chainId,
        });
        const fieldQuery = market?.marketField ?? 0;
        const marketData = await axios.get(
          `${API_BASE_URL}/market/get?page=${currentPage}&limit=10&marketStatus=ACTIVE&marketField=${fieldQuery}`
        );
        formatMarketData(marketData.data.data as MarketDataType[]);
        await refreshUserPosition();
        if (isYes) {
          setSellYesAmount("0.00");
        } else {
          setSellNoAmount("0.00");
        }
      } catch (apiError) {
        console.warn("Withdraw sync failed:", apiError);
        errorAlert("Position sold, but backend sync failed.");
      }
    } catch (error) {
      console.error("sell position error:", error);
      errorAlert("Sell transaction failed.");
    } finally {
      setIsSelling(false);
    }
  };
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
            {elipsKey(market.feedName)}
          </div>
          <div className="lg:w-5 lg:h-5 w-4 h-4 relative overflow-hidden">
            <FaRegStar className="text-white" />
          </div>
        </div>
        <div className="self-stretch flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex-1 text-white lg:text-2xl text-lg font-medium font-rubik">
            {market.question}
          </div>
          <div className="flex-shrink-0">
            <img
              className="lg:w-14 lg:h-14 w-12 h-12 rounded-lg object-cover"
              src={market.imageUrl}
              alt={market.feedName}
            />
          </div>
        </div>
        
        {/* Market Stats */}
        <div className="self-stretch grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <div className="text-[#9EA5B5] text-sm font-semibold">Volume</div>
            <div className="text-white text-sm font-semibold">
              {totalVolumeDisplay.toFixed(3)} BNB
            </div>
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
              {yesPercentageDisplay}%
            </div>
          </div>
          <ProgressBar yesPercentage={yesPercentageDisplay} />
        </div>
      </div>

      <div className="self-stretch w-full rounded-2xl border border-[#1f242c] bg-[#11161c]/70 px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[#9EA5B5] text-sm font-semibold">Price Trend</span>
          <span className="text-white text-sm font-semibold">
            {currentProbability.toFixed(2)}% YES
          </span>
        </div>
        <div className="h-24">
          <PriceSparkline data={priceSeries} />
        </div>
        <p className="text-xs text-[#5f6b7a]">
          Based on cumulative YES / NO stakes as trades settle.
        </p>
      </div>

      <div className="self-stretch flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor={`stake-${market._id}`} className="text-[#9EA5B5] text-sm font-semibold">
            Stake Amount (BNB)
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-[#1f242c] bg-[#12161f] px-4 py-2.5 focus-within:border-[#FCD535] transition-colors">
            <input
              id={`stake-${market._id}`}
              type="number"
              min="0"
              step="0.01"
              value={stakeAmount}
              onChange={(event) => setStakeAmount(event.target.value)}
              className="w-full bg-transparent text-white text-base font-medium font-satoshi outline-none"
              placeholder="0.00"
              inputMode="decimal"
            />
            <span className="text-[#9EA5B5] text-sm font-semibold">BNB</span>
          </div>
        </div>
        <div className="self-stretch flex flex-col sm:flex-row justify-start items-stretch gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isBetting}
            className={`w-full sm:flex-1 px-4 py-2.5 rounded-2xl cursor-pointer transition-all duration-200 flex justify-center items-center gap-2 ${
              isBetting ? "bg-[#223a25]/60 opacity-70 cursor-not-allowed" : "bg-[#223a25] outline outline-[#FCD535]"
            }`}
            onClick={() => onVote(true)}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <Icon name="yes" color="#FCD535" />
            </span>
            <span className="text-[#FCD535] text-lg font-bold font-satoshi leading-7">
              {isBetting ? "Processing..." : "Buy YES"}
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isBetting}
            className={`w-full sm:flex-1 px-4 py-2.5 rounded-2xl cursor-pointer transition-all duration-200 flex justify-center items-center gap-2 ${
              isBetting ? "bg-[#3a2222]/60 opacity-70 cursor-not-allowed" : "bg-[#3a2222] outline outline-[#ff6464]"
            }`}
            onClick={() => onVote(false)}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <Icon name="no" color="#ff6464" />
            </span>
            <span className="text-[#ff6464] text-lg font-bold font-satoshi leading-7">
              {isBetting ? "Processing..." : "Buy NO"}
            </span>
          </motion.button>
        </div>
      </div>

      {connected && (
        <div className="self-stretch flex flex-col gap-4 rounded-2xl border border-[#1f242c] bg-[#11161c]/70 px-4 py-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[#9EA5B5] text-sm font-semibold">Your Position</span>
              <span className="text-white text-xs font-medium">
                YES: {userPosition.yes.toFixed(4)} BNB • NO: {userPosition.no.toFixed(4)} BNB
              </span>
            </div>
            <p className="text-xs text-[#5f6b7a]">
              Sell shares back before the market closes to unlock BNB.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[#9EA5B5]">
                <span>Sell YES</span>
                <button
                  type="button"
                  className="text-[#FCD535] hover:text-white transition-colors"
                  onClick={() => setSellYesAmount(userPosition.yes.toFixed(4))}
                >
                  Max
                </button>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-[#1f242c] bg-[#12161f] px-4 py-2.5 focus-within:border-[#FCD535] transition-colors">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={sellYesAmount}
                  onChange={(event) => setSellYesAmount(event.target.value)}
                  className="w-full bg-transparent text-white text-base font-medium font-satoshi outline-none"
                  placeholder="0.00"
                  inputMode="decimal"
                />
                <span className="text-[#9EA5B5] text-sm font-semibold">BNB</span>
              </div>
              <button
                type="button"
                disabled={isSelling || userPosition.yes <= 0}
                onClick={() => onSell(true)}
                className={`w-full rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isSelling || userPosition.yes <= 0
                    ? "bg-[#223a25]/40 cursor-not-allowed opacity-60"
                    : "bg-[#223a25] text-[#FCD535] hover:bg-[#223a25]/80"
                }`}
              >
                {isSelling ? "Processing..." : "Sell YES"}
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[#9EA5B5]">
                <span>Sell NO</span>
                <button
                  type="button"
                  className="text-[#ff6464] hover:text-white transition-colors"
                  onClick={() => setSellNoAmount(userPosition.no.toFixed(4))}
                >
                  Max
                </button>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-[#1f242c] bg-[#12161f] px-4 py-2.5 focus-within:border-[#ff6464] transition-colors">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={sellNoAmount}
                  onChange={(event) => setSellNoAmount(event.target.value)}
                  className="w-full bg-transparent text-white text-base font-medium font-satoshi outline-none"
                  placeholder="0.00"
                  inputMode="decimal"
                />
                <span className="text-[#9EA5B5] text-sm font-semibold">BNB</span>
              </div>
              <button
                type="button"
                disabled={isSelling || userPosition.no <= 0}
                onClick={() => onSell(false)}
                className={`w-full rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isSelling || userPosition.no <= 0
                    ? "bg-[#3a2222]/40 cursor-not-allowed opacity-60"
                    : "bg-[#3a2222] text-[#ff6464] hover:bg-[#3a2222]/80"
                }`}
              >
                {isSelling ? "Processing..." : "Sell NO"}
              </button>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default PredictionCard;







