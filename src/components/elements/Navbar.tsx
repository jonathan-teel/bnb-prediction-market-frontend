import React, { useState, useRef, useEffect } from "react";
import Icon from "./Icons";
import { IconName } from "./Icons/Icons";
import SearchInputItem from "./marketInfo/SearchInputItem";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const searchInputs = [
  { title: "Volume", minPlaceholder: "Min", maxPlaceholder: "Max" },
  { title: "Expiry Time", minPlaceholder: "Start", maxPlaceholder: "End" },
  { title: "Yes Probability", minPlaceholder: "Min", maxPlaceholder: "Max" },
  { title: "No Probability", minPlaceholder: "Min", maxPlaceholder: "Max" },
];

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
  onToggleRecentActivity 
}) => {
  // Keep track of the selected category using state
  const [activeCategory, setActiveCategory] = useState<string>("Trending");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const searchPadRef = useRef<HTMLDivElement | null>(null);

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    onCategorySelect(category);
  };

  const handleFilterClick = () => {
    setShowFilter((prevState) => !prevState);
  };

  // Close the search input pad if clicked outside
  const handleClickOutside = (e: MouseEvent) => {
    if (
      filterRef.current &&
      !filterRef.current.contains(e.target as Node) &&
      searchPadRef.current &&
      !searchPadRef.current.contains(e.target as Node)
    ) {
      setShowFilter(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4 px-4 sm:px-6 rounded-2xl border border-[#1f242c] bg-[#11161c]/85 backdrop-blur-md shadow-[0_20px_44px_-34px_rgba(8,12,18,0.75)] relative">
      <div className="flex flex-wrap items-center lg:gap-6 gap-2">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategorySelect(category.name)}
            className={`sm:px-5 px-3 pb-3 flex cursor-pointer justify-start items-center gap-2 transition-all duration-300 ease-in-out relative group uppercase tracking-[0.14em] text-xs sm:text-sm ${
              activeCategory === category.name ? "text-[#FCD535]" : "text-[#9EA5B5] hover:text-white"
            }`}
          >
            <div className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#fcd535] via-[#f1c240] to-transparent transition-all duration-300 ease-in-out ${activeCategory === category.name ? "w-full" : "w-0 group-hover:w-full"}`} />

            <div className="w-5 h-5">
              <Icon
                name={category.icon}
                color={activeCategory === category.name ? "#FCD535" : "#9EA5B5"}
                className="transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
            </div>
            <div className={`justify-start text-sm md:text-base font-medium leading-7 ${activeCategory === category.name ? "text-white" : "hidden md:flex text-[#9EA5B5]"}`}>
              {category.name}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">

        <div
          data-active={showFilter ? "On" : "Off"}
          ref={filterRef}
          className="sm:px-4 sm:py-2.5 px-2.5 py-1 bg-[#181a20] rounded-2xl cursor-pointer border border-[#1f242c] flex justify-start items-center gap-2 transition-all duration-300 ease-in-out hover:border-[#2a313a] hover:bg-[#15191f] active:scale-95"
          onClick={handleFilterClick}
        >
          <div className="w-4 h-4 relative overflow-hidden">
            <Icon name="Filter" color="white" />
          </div>
          <div className="hidden lg:flex text-white text-base font-medium font-satoshi leading-normal group-hover:text-[#FCD535] transition-all duration-300">
            Filter
          </div>
        </div>
        <button
          onClick={onToggleRecentActivity}
          className="sm:px-4 sm:py-2.5 px-2.5 py-1 bg-[#181a20] rounded-2xl cursor-pointer border border-[#1f242c] flex justify-start items-center gap-2 transition-all duration-300 ease-in-out hover:border-[#2a313a] hover:bg-[#15191f] active:scale-95"
        >
          {showRecentActivity ? (
            <IoEyeOffOutline className="text-white text-xl" />
          ) : (
            <IoEyeOutline className="text-white text-xl" />
          )}
        </button>
      </div>

      {showFilter && (
        <div
          ref={searchPadRef}
          className="z-50 p-5 right-0 top-[70px] absolute bg-[#11161c] border border-[#1f242c] rounded-[20px] shadow-[0_20px_60px_-28px_rgba(5,8,17,0.9)] flex flex-col justify-start items-center gap-4 max-w-[calc(100vw-2rem)]"
        >
          {searchInputs.map((input, index) => (
            <SearchInputItem
              key={index}
              title={input.title}
              minPlaceholder={input.minPlaceholder}
              maxPlaceholder={input.maxPlaceholder}
            />
          ))}
          <div className="self-stretch flex justify-start items-start gap-2">
            <div
              className="flex-1 px-4 cursor-pointer py-2.5 rounded-[100px] border border-[#2a313a] flex justify-center items-center gap-1 transition-all duration-300 hover:bg-[#15191f] hover:border-[#fcd535]/40 hover:text-white active:scale-95"
            >
              <div
                className="justify-center text-[#9EA5B5] text-sm font-medium font-satoshi leading-[14px] transition-all duration-300 group-hover:text-white"
              >
                Reset
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
