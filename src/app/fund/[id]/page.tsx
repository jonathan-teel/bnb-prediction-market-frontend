"use client";
import FundNavbar from "@/components/elements/fund/FundNavbar";
import BnbCounter from "@/components/elements/fund/BnbCounter";
import Icon from "@/components/elements/Icons";
import { CiStar } from "react-icons/ci";
import { GoArrowDownRight, GoQuestion } from "react-icons/go";
import { ImAlarm } from "react-icons/im";
import { useParams } from "next/navigation";
import { useGlobalContext } from "@/providers/GlobalContext";
import { marketField } from "@/data/data";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getCountDown } from "@/utils";
import { depositLiquidity } from "@/components/prediction_market_sdk";
import { errorAlert, infoAlert } from "@/components/elements/ToastGroup";
import axios from "axios";
import { useWallet } from "@/providers/WalletProvider";

export default function FundDetail() {
  const { markets } = useGlobalContext(); // Ensure setActiveTab exists in context
  const [counter, setCounter] = useState("7d : 6h : 21m : 46s");
  const [fundAmount, setAmount] = useState(0);
  const router = useRouter();
  const { address, connected } = useWallet();

  if (markets.length === 0) {
    router.replace("/fund"); // Navigate to dynamic page
    return
  }

  const param = useParams();
  const index = Number(param.id);
  const market = markets[index];

  useEffect(() => {
    const interval = setInterval(() => {
      let remainTime = getCountDown(market.date);
      setCounter(remainTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onFund = async () => {
    try {
      if (!connected || !address) {
        errorAlert("Please connect your wallet before funding.");
        return;
      }

      if (fundAmount <= 0) {
        errorAlert("Enter an amount greater than zero.");
        return;
      }

      const signaturePayload = await depositLiquidity({
        amount: fundAmount,
        marketId: market._id,
      });

      const result = await axios.post("http://localhost:8080/api/market/liquidity", {
        market_id: market._id,
        amount: fundAmount,
        investor: address,
        active: true,
        signature: signaturePayload.signature,
        signedMessage: signaturePayload.message,
        chainId: signaturePayload.chainId,
      });

      if (result.status === 200) {
        infoAlert("Funed successfully!");
        router.replace(`/fund`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      errorAlert("Failed deploying fund!")
    }
  }
  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] flex flex-col gap-10 overflow-x-hidden">
      <div className="w-full flex flex-wrap items-center gap-2 text-sm sm:text-base">
        <div className="text-[#9EA5B5] text-sm sm:text-base lg:text-lg font-normal cursor-pointer font-rubic leading-relaxed">
          {marketField[market.marketField].name}
        </div>
        <div className="text-[#9EA5B5] text-sm sm:text-base lg:text-lg font-normal font-rubic leading-relaxed">
          {">"}
        </div>
        <div className="text-white text-sm sm:text-base lg:text-lg font-normal font-rubic leading-relaxed">
          {market.question}
        </div>
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-[50px]">
        <div className="w-full flex flex-col gap-6">
          <div className="w-full p-5 sm:p-6 bg-[#1a1f26] rounded-2xl border border-[#1f242c] flex flex-col gap-8 sm:gap-10">
            <div className="w-full flex flex-col 2xl:flex-row justify-start items-start gap-6 2xl:gap-8">
              <img
                className="2xl:w-[264px] 2xl:h-[264px] xl:w-[200px] xl:h-[200px] hidden rounded-2xl"
                src="/fund.png"
                alt=""
              />
              <div className="flex-1 flex flex-col gap-5 sm:gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex w-full items-start justify-between gap-3">
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="inline-flex items-center gap-2">
                        <div className="text-[#FCD535] text-sm sm:text-base font-semibold font-interSemi leading-normal">
                          {marketField[market.marketField].name}
                        </div>
                      </div>
                      <h1 className="text-white text-2xl sm:text-3xl lg:text-[40px] font-medium font-rubik leading-snug sm:leading-[48px]">
                        {market.question}
                      </h1>
                    </div>
                    <div className="hidden sm:flex gap-1">
                      <div
                        data-size="Medium"
                        data-type="Tertiary"
                        className="cursor-pointer rounded-2xl flex items-center gap-2 px-3 py-2 bg-[#11161c] border border-[#1f242c]"
                      >
                        <div className="w-5 h-5 relative overflow-hidden cursor-pointer">
                          <Icon name="Message" size={20} />
                        </div>
                        <div className="text-white text-sm font-medium font-satoshi leading-6">
                          45
                        </div>
                      </div>
                      <button
                        type="button"
                        className="h-10 w-10 rounded-2xl border border-[#1f242c] bg-[#11161c] flex items-center justify-center"
                      >
                        <CiStar className="text-white text-xl" />
                      </button>
                    </div>
                  </div>
                  <div className="flex sm:hidden gap-2">
                    <div
                      data-size="Medium"
                      data-type="Tertiary"
                      className="cursor-pointer rounded-xl flex items-center gap-2 px-3 py-2 bg-[#11161c] border border-[#1f242c]"
                    >
                      <div className="w-4 h-4 relative overflow-hidden cursor-pointer">
                        <Icon name="Message" size={16} />
                      </div>
                      <div className="text-white text-sm font-medium font-satoshi leading-5">
                        45
                      </div>
                    </div>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-xl border border-[#1f242c] bg-[#11161c] flex items-center justify-center"
                    >
                      <CiStar className="text-white text-lg" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-start gap-3">
                  <div className="text-left sm:text-right text-[#9EA5B5] text-base font-normal font-interSemi leading-relaxed">
                    Expires in
                  </div>
                  <div className="px-3 py-2 bg-[#FCD535]/10 rounded-xl inline-flex items-center gap-2">
                    <div className="w-5 h-5 relative overflow-hidden flex items-center justify-center">
                      <ImAlarm
                        color="#FCD535"
                        size={25}
                        className="flex justify-between items-center"
                      />
                    </div>
                    <div className="text-[#FCD535] text-base sm:text-lg font-medium font-satoshi leading-relaxed">
                      {counter}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="text-left sm:text-right text-[#9EA5B5] text-base sm:text-lg font-normal font-interSemi leading-relaxed">
                    Initial Funding
                  </div>
                  <div className="w-full min-h-[88px] p-4 bg-[#0b0e11] rounded-2xl border border-[#1f242c] flex flex-col gap-4">
                    <div className="w-full h-[23px] flex justify-between items-center">
                      {Array.from({ length: 20 }).map((_, index) => {
                        const filledSegments = Math.floor((market.totalInvestment / 0.1) * 20);
                        const isFilled = index < filledSegments;
                        return (
                          <div
                            key={index}
                            className={`sm:w-[11px] w-[6px] h-full ${
                              isFilled ? 'bg-[#FCD535]' : 'bg-[#9EA5B5]'
                            } rounded-[100px] animate-pulse [animation-delay:${index * 100}ms]`}
                          />
                        );
                      })}
                    </div>
                    <div className="w-full rounded-xl flex justify-between items-center">
                      <div className="justify-start">
                        <span className="text-[#FCD535] text-base sm:text-lg font-semibold font-interSemi leading-relaxed">
                          {parseFloat(Number(market.totalInvestment).toFixed(9)).toString()}
                        </span>
                        <span className="text-[#9EA5B5] text-base sm:text-lg font-semibold font-interSemi leading-relaxed">
                          / 30
                        </span>
                      </div>
                      <div className="text-right text-white text-base sm:text-lg font-semibold font-interSemi leading-relaxed">
                        BNB Raised
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <div className="text-[#9EA5B5] text-base sm:text-lg font-medium font-satoshi leading-relaxed">
                    Oracle Resolver
                  </div>
                  <div className="text-white text-base sm:text-lg font-medium font-satoshi leading-relaxed">
                    {marketField[market.marketField].content[market.apiType].api_name}
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <div className="text-[#9EA5B5] text-base sm:text-lg font-medium font-satoshi leading-relaxed">
                    Descriptions
                  </div>
                  <div className="w-full">
                    <span className="text-white text-base sm:text-lg font-medium font-satoshi leading-relaxed">
                      {market.description}
                    </span>
                  </div>
                  <div className="w-full flex justify-start sm:justify-end">
                    {/* <div className="flex justify-center items-end cursor-pointer gap-2">
                      <div className="justify-start text-[#FCD535] text-lg font-medium font-satoshi leading-relaxed">
                        Read more
                      </div>
                      <div className="w-4 h-4 relative overflow-hidden">
                        <GoArrowDownRight color="#FCD535" size={16} />
                      </div>
                    </div> */}
                    <div className="text-left sm:text-center text-[#9EA5B5] text-sm font-medium font-satoshi">
                      Note: This event are legally protected
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-[420px] w-full px-5 sm:px-6 pt-6 pb-8 bg-[#1a1f26] rounded-2xl border border-[#1f242c] flex flex-col items-center gap-6 sm:gap-8">
          <div className="w-full flex flex-col gap-1">
            <div className="w-full flex flex-wrap items-center gap-2">
              <div className="text-white text-2xl sm:text-[32px] font-medium font-rubik leading-[36px] sm:leading-[48px]">
                Fund
              </div>
            </div>
            <div className="text-[#9EA5B5] text-base sm:text-lg font-normal font-satoshi leading-relaxed">
              Start funding for this Topic
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="w-full flex items-center gap-1">
              <div className="text-[#9EA5B5] text-sm sm:text-base font-medium font-satoshi leading-none">
                Amount
              </div>
              <div className="w-4 h-4 relative overflow-hidden">
                <GoQuestion className="text-gray font-bold" />
              </div>
            </div>
            <BnbCounter amount={fundAmount} setAmount={setAmount} />
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-wrap justify-between items-center gap-2">
              <div className="text-[#9EA5B5] text-sm sm:text-base font-medium font-satoshi leading-none">
                Fund Amount
              </div>
              <div className="text-[#9EA5B5] text-base font-bold font-satoshi leading-none">
                {fundAmount} BNB
              </div>
            </div>
            <div className="w-full flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-1 text-[#9EA5B5] text-sm sm:text-base font-medium font-satoshi leading-none">
                <span>Yield Rights</span>
                <span className="w-4 h-4 relative overflow-hidden">
                  <GoQuestion className="text-gray font-bold" />
                </span>
              </div>
              <div className="text-[#9EA5B5] text-base font-bold font-satoshi leading-none">
                {fundAmount > 0 ? ((fundAmount / (market.totalInvestment + fundAmount)) * 100).toFixed(2) : "0.00"}%
              </div>
            </div>
            <div className="w-full flex flex-wrap justify-between items-center gap-2">
              <div className="text-[#9EA5B5] text-sm sm:text-base font-medium font-satoshi leading-none">
                Gas Fee
              </div>
              <div className="text-[#9EA5B5] text-base font-bold font-satoshi leading-none">
                0.001 BNB
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col items-center gap-4">
            <div
              data-size="Big"
              data-type="Prime"
              onClick={() => onFund()}
              className="w-full px-6 py-3.5 hover:cursor-pointer bg-[#FCD535] hover:bg-[#FCD535]/50 rounded-2xl shadow-[inset_0px_3px_0px_0px_rgba(255,255,255,0.16)] flex justify-center items-center gap-2"
            >
              <div className="text-[#111111] text-lg sm:text-xl font-medium font-satoshi leading-7">
                Fund Now
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-center sm:text-left">
              <div className="text-[#9EA5B5] text-sm sm:text-base font-normal font-satoshi leading-none">
                By clicking Fund you agree to
              </div>
              <div className="text-[#FCD535] text-sm sm:text-base font-medium font-satoshi underline leading-none">
                Terms and Conditions
              </div>
            </div>
          </div>
        </div>
      </div>
      <FundNavbar />
    </div>
  );
}





