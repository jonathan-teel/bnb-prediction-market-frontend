"use client";

import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

import DashboardHero from "@/components/elements/hero/DashboardHero";
import MarketCarousel from "@/components/elements/carousel/MarketCarousel";
import Market from "@/components/elements/marketInfo/Market";
import RecentList from "@/components/elements/marketInfo/RecentList";

export default function Home() {
  const [showRecentActivity, setShowRecentActivity] = useState(true);

  return (
    <>
      <DashboardHero />

      <section className="flex flex-col gap-6">
        <MarketCarousel />
      </section>

      <section className="flex flex-col gap-6 2xl:flex-row">
        <div className={`flex-1 min-w-0 ${showRecentActivity ? "2xl:pr-6" : ""}`}>
          <Market
            showRecentActivity={showRecentActivity}
            onToggleRecentActivity={() => setShowRecentActivity((prev) => !prev)}
          />
        </div>

        <div className="flex w-full flex-col gap-4 2xl:w-[420px]">
          <div className="flex items-center justify-between rounded-2xl border border-[#1f242c] bg-[#11161c] px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              <p className="text-xs text-[#5f6b7a]">Live trades, market updates, and resolutions</p>
            </div>
            <button
              type="button"
              onClick={() => setShowRecentActivity((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2a313a] text-[#9EA5B5] transition-colors duration-300 hover:border-[#FCD535]/60 hover:text-white"
            >
              {showRecentActivity ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
            </button>
          </div>
          {showRecentActivity ? (
            <div className="rounded-2xl border border-[#1f242c] bg-[#0b0e11]/80 px-5 py-4 shadow-[0_24px_48px_-40px_rgba(6,12,20,0.65)]">
              <RecentList />
            </div>
          ) : (
            <div className="rounded-2xl border border-[#1f242c] bg-[#0b0e11]/60 px-5 py-6 text-sm text-[#5f6b7a]">
              Activity feed hidden. Toggle the eye icon to bring it back.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
