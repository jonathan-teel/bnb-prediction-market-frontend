"use client";

import FundCard from "@/components/elements/fund/FundCard";
import Market from "@/components/elements/marketInfo/Market";
import { useGlobalContext } from "@/providers/GlobalContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function FundMarket() {
  const pathname = usePathname();
  const { setActiveTab } = useGlobalContext();

  useEffect(() => {
    if (pathname === "/fund") {
      setActiveTab("PENDING");
    }
  }, [pathname, setActiveTab]);

  return (
    <section className="flex w-full flex-col gap-8">
      <FundCard
        title="Will Bitcoin hit 100K by April?"
        description="This market resolves to 'Yes' if Bitcoin hits 100K by April. Otherwise, it resolves to 'No'."
        category="Cryptocurrency"
        imageUrl="/fund.png"
        votes={45}
        progress={8} // Progress out of 30
        solRaised="8.9 BNB"
        expiresIn="7d : 6h : 21m : 46s"
      />
      <Market />
    </section>
  );
}
