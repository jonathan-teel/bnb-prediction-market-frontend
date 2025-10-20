"use client";

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
      <Market />
    </section>
  );
}
