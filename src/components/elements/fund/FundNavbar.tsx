import React, { useMemo, useState } from "react";

const TABS = ["Comments", "Top Funders", "Activity"] as const;

const FundNavbar = () => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Comments");

  const emptyStateCopy = useMemo<Record<(typeof TABS)[number], string>>(
    () => ({
      Comments: "No comments yet. Be the first to share your thoughts.",
      "Top Funders": "Funding data will appear once liquidity arrives.",
      Activity: "Trading activity will show up here after the market goes live.",
    }),
    []
  );

  return (
    <div className="self-stretch flex w-full flex-col justify-start items-start gap-6">
      {/* Navbar */}
      <div className="self-stretch flex flex-wrap justify-start items-center gap-3">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-2xl flex justify-start items-center gap-2 cursor-pointer transition-all duration-300 uppercase tracking-[0.18em] text-xs sm:text-sm ${
                isActive
                  ? "bg-[#181a20] border border-[#fcd535]/50 text-white shadow-[0_18px_32px_-24px_rgba(240,185,11,0.5)]"
                  : "border border-[#1f242c] text-[#9EA5B5] hover:border-[#2a313a] hover:bg-[#15191f] hover:text-white"
              }`}
            >
              {tab}
            </div>
          );
        })}
      </div>

      <div className="self-stretch flex w-full flex-col justify-start items-start gap-4 rounded-2xl border border-[#1f242c] bg-[#1a1f26] p-6 text-[#9EA5B5] text-sm font-medium">
        {emptyStateCopy[activeTab]}
      </div>
    </div>
  );
};

export default FundNavbar;


