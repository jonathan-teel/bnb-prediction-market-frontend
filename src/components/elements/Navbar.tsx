import React, { useState } from "react";
import Icon from "./Icons";
import { IconName } from "./Icons/Icons";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

type Category = {
  name: string;
  active: boolean;
  icon: IconName;
  color: string;
};

type NavbarProps = {
  categories: Category[];
  onCategorySelect: (category: string) => void;
  showRecentActivity?: boolean;
  onToggleRecentActivity?: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  categories,
  onCategorySelect,
  showRecentActivity = true,
  onToggleRecentActivity,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("Trending");

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    onCategorySelect(category);
  };

  return (
    <nav className="relative flex w-full flex-col gap-4 rounded-2xl border border-[#1f242c] bg-[#11161c]/85 px-4 py-4 shadow-[0_20px_44px_-34px_rgba(8,12,18,0.75)] backdrop-blur-md sm:px-6 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2 lg:gap-6">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleCategorySelect(category.name)}
            className={`group relative flex cursor-pointer items-center gap-2 px-3 pb-3 uppercase tracking-[0.14em] text-xs transition-all duration-300 ease-in-out sm:px-5 sm:text-sm ${
              activeCategory === category.name
                ? "text-[#FCD535]"
                : "text-[#9EA5B5] hover:text-white"
            }`}
          >
            <span
              className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#fcd535] via-[#f1c240] to-transparent transition-all duration-300 ease-in-out ${
                activeCategory === category.name ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
            <span className="h-5 w-5">
              <Icon
                name={category.icon}
                color={activeCategory === category.name ? "#FCD535" : "#9EA5B5"}
                className="transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
            </span>
            <span
              className={`hidden text-sm font-medium leading-7 md:flex ${
                activeCategory === category.name ? "text-white" : "text-[#9EA5B5]"
              }`}
            >
              {category.name}
            </span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onToggleRecentActivity}
          className="flex items-center gap-2 rounded-2xl border border-[#1f242c] bg-[#181a20] px-2.5 py-1 transition-all duration-300 ease-in-out hover:border-[#2a313a] hover:bg-[#15191f] active:scale-95 sm:px-4 sm:py-2.5"
          aria-label="Toggle recent activity"
        >
          {showRecentActivity ? (
            <IoEyeOffOutline className="text-xl text-white" />
          ) : (
            <IoEyeOutline className="text-xl text-white" />
          )}
          <span className="hidden text-sm font-medium uppercase tracking-[0.2em] text-[#9EA5B5] sm:inline-flex">
            {showRecentActivity ? "Hide Activity" : "Show Activity"}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

