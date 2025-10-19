export interface MarketCarouselItemProps {
  category: string;
  title: string;
  bgImage: string;
  mainImage: string;
  overlayImage: string;
  volume: string;
  timeLeft: string;
  yesPercentage: number;
  comments: number;
}

export interface Prediction {
  category: string;
  question: string;
  volume: string;
  timeLeft: string;
  comments: number;
  yesPercentage: number;
  imageUrl: string;
  onVote?: () => void;
}

export interface PendingData {
  category: string;
  question: string;
  volume: string;
  timeLeft: string;
  comments: number;
  imageUrl: string;
}

export interface ProposeType {
  marketField: number;
  imageUrl: string;
  range: number;
  apiType: number;
  question: string;
  feedName: string;
  dataLink: string;
  date: string;
  task: string;
  value: number;
  creator: string;
  description: string;
}

export type GlobalSettingType = {
  creatorFeeAmount: number;
  liqudityUserFeeAmount: number;
  bettingUserFeeAmount: number;
  marketCount: number;
  decimal: number;
  feePercentage: number;
};

export type MarketStatus = "INIT" | "PENDING" | "ACTIVE" | "CLOSED";

export type MarketDataType = {
  _id: string;
  marketField: number;
  apiType: number;
  task: string;
  creator: string;
  tokenA: string;
  tokenB: string;
  market: string;
  question: string;
  feedName: string;
  value: number;
  range: number;
  date: string;
  marketStatus: string;
  imageUrl: string;
  createdAt: string;
  __v: number;
  playerACount: number;
  playerBCount: number;
  totalInvestment: number;
  description: string;
  comments: number;
};

export type ReferralType = {
  wallet: string;
  referralCode: string;
  referredLevel: number;
  fee: number;
  status: "PENDING" | "ACTIVE";
  wallet_refered: string;
  createdAt: string;
};
