"use client"

import { useState } from "react";
import { AboutSection } from "@/components/elements/about/AboutSection";
import AboutSubSidebar from "@/components/elements/about/AboutSubSidebar";

export default function AboutPage() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  return (
    <section className="grid w-full grid-cols-1 gap-6 md:grid-cols-[minmax(220px,260px)_1fr] md:gap-8">
      <div className="rounded-2xl border border-[#1f242c]/70 bg-[#0c1119]/60 p-4 shadow-[0_20px_40px_-32px_rgba(6,12,20,0.75)] md:sticky md:top-4 md:self-start md:p-5 md:shadow-none md:backdrop-blur-lg">
        <AboutSubSidebar selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
      </div>
      <div className="flex flex-col rounded-3xl border border-[#1f242c]/70 bg-[#0c1119]/70 px-4 py-5 shadow-[0_24px_60px_-28px_rgba(6,12,20,0.85)] md:px-6 md:py-8">
        <AboutSection selectedIndex={selectedIndex} />
      </div>
    </section>
  );
}
