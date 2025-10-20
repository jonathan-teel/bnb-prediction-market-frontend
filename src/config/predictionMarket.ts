"use client";

import { TARGET_CHAIN_ID } from "@/config/network";

const fallbackAddress = "0xbFE71302361596be1F789fd789ad4eaF7cb63913";

const resolveEnv = (key: string): string | undefined => {
  if (typeof process === "undefined" || !process.env) return undefined;
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
};

export const PREDICTION_MARKET_ADDRESS =
  resolveEnv("NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS") ?? fallbackAddress;

export const PREDICTION_MARKET_ABI = [
  "function creationFee() view returns (uint256)",
  "function provideLiquidity(uint256 marketId) payable returns (uint256)",
  "function placeBet(uint256 marketId, bool isYes) payable returns (uint256)",
  "function withdrawLiquidity(uint256 marketId, uint256 amount)",
  "function claimWinnings(uint256 marketId)",
  "function claimLiquidityFees(uint256 marketId)",
  "function refundLiquidity(uint256 marketId)",
  "function markets(uint256) view returns (string question,string metadataURI,uint64 closingTime,address creator,uint256 totalYesStake,uint256 totalNoStake,uint256 totalLiquidity,uint8 outcome,bool resolved,uint256 totalLiquidityShares,uint256 accFeePerShare)",
  "function marketCount() view returns (uint256)",
  "function getBetPosition(uint256, address) view returns (uint256 yesStake, uint256 noStake, bool claimed)",
  "function getLiquidityPosition(uint256, address) view returns (uint256 depositAmount, uint256 pendingFees, uint256 shares)",
  "event MarketCreated(uint256 indexed marketId, address indexed creator, string question, uint64 closingTime, string metadataURI)",
  "event LiquidityProvided(uint256 indexed marketId, address indexed provider, uint256 amount, uint256 feeCharged)",
  "event BetPlaced(uint256 indexed marketId, address indexed bettor, bool isYes, uint256 stake, uint256 feeCharged)",
  "event MarketResolved(uint256 indexed marketId, uint8 outcome)"
] as const;

export const TARGET_EXPLORER_BASE =
  TARGET_CHAIN_ID === "0x38"
    ? "https://bscscan.com/tx/"
    : "https://testnet.bscscan.com/tx/";
