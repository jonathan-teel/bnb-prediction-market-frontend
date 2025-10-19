import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect } from "react";

interface ProfileFundItemProps {
  image: string;
  title: string;
  status: "Pending" | "Active" | "Expired";
  betAmount: number;
  percentage: number;
  value: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-[#FCD535]/10 text-[#FCD535]",
  ACTIVE: "bg-[#FCD535]/10 text-[#FCD535]",
  Expired: "bg-[#ff6464]/10 text-[#ff6464]",
};

const ProfileFundItem = (param: any) => {
  const [betAmount, setBetAmount] = React.useState(0);
  const [percentage, setPercentage] = React.useState(0);
  const { publicKey } = useWallet();
  useEffect(() => {
    const userFund = param.investors.find((f:any) => f.investor === publicKey?.toBase58());
    const totalAmount = param.investors.reduce((sum:any, i:any) => sum + i.amount, 0);
    
    setBetAmount(userFund.amount);
    setPercentage(userFund.amount/totalAmount*100);
  }, [])
  return (
    <div className="self-stretch p-4 bg-[#1a1f26] rounded-2xl border border-[#1f242c] inline-flex justify-start items-center gap-3">
      <img className="w-8 h-8 rounded-lg" src={param.imageUrl} alt="market-icon" />
      <div className="flex-1 justify-center text-white text-sm font-medium font-satoshi leading-relaxed">
        {param.question}
      </div>
      <div className="w-[100px] rounded-[100px] inline-flex flex-col justify-center items-start">
        <div
          className={`px-2.5 ${statusColors[param.marketStatus]} rounded-[100px] inline-flex justify-center items-center gap-2.5`}
        >
          <div className="justify-start text-sm font-medium font-satoshi leading-normal">
            {param.marketStatus}
          </div>
        </div>
      </div>
      <div className="w-[120px] flex justify-start items-center gap-1">
        {/* <div className="justify-start text-[#9EA5B5] text-sm font-medium font-satoshi leading-relaxed">
          {betAmount} BNB /
        </div> */}
        <div className="w-[50px] justify-start text-[#FCD535] text-sm font-medium font-satoshi leading-relaxed">
          {percentage.toFixed(1)}%
        </div>
      </div>
      <div className="w-[100px] justify-start text-white text-sm font-medium font-interSemi leading-relaxed">
        {betAmount} BNB
      </div>
    </div>
  );
};

export default ProfileFundItem;





