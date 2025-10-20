import React, { useState } from "react";

interface AboutSubSidebarProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const SidebarItem: React.FC<{ title: string; isActive: boolean; onClick: () => void }> = ({ title, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`self-stretch px-3 py-2 border-l-4 cursor-pointer transition-colors duration-200 rounded-lg md:rounded-none ${
      isActive
        ? "border-[#FCD535] bg-[#1e2329] text-[#FCD535] font-bold"
        : "border-transparent text-[#9EA5B5] hover:border-[#FCD535] hover:text-[#FCD535]"
    } flex justify-start items-center`}
  >
    <div className="flex-1 justify-start text-base font-normal font-['Rubik'] leading-normal">
      {title}
    </div>
  </div>
);

const AboutSubSidebar: React.FC<AboutSubSidebarProps> = ({ selectedIndex, setSelectedIndex }) => {
  const items = [
    "What is BnbPredectionMaket?",
    "How do prediction markets work?",
    "Is BnbPredectionMaket safe and secure?",
    "How do I participate?",
    "What can I predict on BnbPredectionMaket?",
    "How does BnbPredectionMaket make money?",
  ];

  return (
    <div className="w-full md:w-auto flex flex-row md:flex-col items-start md:items-stretch gap-1 md:gap-2.5 px-2 md:px-0 py-2 md:py-0 bg-transparent">
      {items.map((title, index) => (
        <SidebarItem
          key={index}
          title={title}
          isActive={index === selectedIndex}
          onClick={() => setSelectedIndex(index)}
        />
      ))}
    </div>
  );
};

export default AboutSubSidebar;


