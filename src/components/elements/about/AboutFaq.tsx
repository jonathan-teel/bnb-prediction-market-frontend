import React, { useState } from "react";

interface SidebarItemProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ title, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`self-stretch pl-${isActive ? "4" : "7"} py-2 border-l cursor-pointer transition-colors duration-200 ${
      isActive ? "border-[#FCD535] text-[#FCD535]" : "border-[#9EA5B5] text-[#9EA5B5] hover:border-[#FCD535] hover:text-[#FCD535]"
    } flex justify-start items-center gap-2.5`}
  >
    <div className="flex-1 justify-start text-base font-normal font-['Rubik'] leading-normal">
      {title}
    </div>
  </div>
);

const SidebarFaq: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const items = [
    "ChainTrend: Democratizing Finance Through Innovation",
    "An Unprecedented Asset Class: Event Contracts",
    "Leveling the Playing Field",
    "A Marketplace of Ideas",
    "The Power of Yes & No",
    "Our Commitment",
  ];

  return (
    <div className="self-stretch w-full px-4 sm:px-10 py-6 border-l border-[#313131] flex flex-col sm:flex-row justify-start items-start gap-4">
      <div className="w-full sm:w-56 flex flex-col justify-start items-start">
        {items.map((title, index) => (
          <SidebarItem key={index} title={title} isActive={index === activeIndex} onClick={() => setActiveIndex(index)} />
        ))}
      </div>
    </div>
  );
};

export default SidebarFaq;


