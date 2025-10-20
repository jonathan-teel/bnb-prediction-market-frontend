import React, { useEffect } from "react";
import { useWallet } from "@/providers/WalletProvider";

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
  const { address } = useWallet();

  useEffect(() => {
    if (!address || !Array.isArray(param.investors) || param.investors.length === 0) {
      setBetAmount(0);
      setPercentage(0);
      return;
    }

    const userFund = param.investors.find((f: any) => f.investor?.toLowerCase() === address.toLowerCase());
    const totalAmount = param.investors.reduce((sum: number, investor: any) => sum + investor.amount, 0);

    if (!userFund || totalAmount === 0) {
      setBetAmount(0);
      setPercentage(0);
      return;
    }

    setBetAmount(userFund.amount);
    setPercentage((userFund.amount / totalAmount) * 100);
  }, [address, param.investors]);
  const statusClass = statusColors[param.marketStatus] ?? "bg-[#9EA5B5]/10 text-[#9EA5B5]";

  return (
    <div className="self-stretch w-full p-4 bg-[#1a1f26] rounded-2xl border border-[#1f242c] flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex w-full items-start gap-3 sm:flex-1">
        <img className="w-10 h-10 rounded-lg object-cover" src={param.imageUrl} alt="market-icon" />
        <div className="flex-1 text-white text-sm font-medium font-satoshi leading-relaxed">
          {param.question}
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:justify-end">
        <div className="rounded-[100px]">
          <div className={`px-3 py-1.5 ${statusClass} rounded-[100px] flex items-center justify-center gap-2`}>
            <div className="text-sm font-medium font-satoshi leading-normal">
              {param.marketStatus}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#FCD535] text-sm font-medium font-satoshi leading-relaxed">
          {percentage.toFixed(1)}%
        </div>
        <div className="text-white text-sm font-medium font-interSemi leading-relaxed">
          {betAmount} BNB
        </div>
      </div>
    </div>
  );
};

export default ProfileFundItem;





