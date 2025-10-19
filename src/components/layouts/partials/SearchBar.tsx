"use client";

import Icon from "@/components/elements/Icons";

interface SearchBarProps {
  placeholder?: string;
  showShortcut?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search",
  showShortcut = true,
}) => {
  return (
    <div className="w-full max-w-[480px] px-4 py-3 bg-[#11161c] rounded-2xl border border-[#1f242c] flex items-center gap-3">
      <Icon name="Search" />
      <input
        type="text"
        placeholder={placeholder}
        aria-label="Search"
        className="flex-1 bg-transparent text-[#9EA5B5] text-base font-medium font-satoshi leading-normal outline-none placeholder-[#9EA5B5]"
      />
      {showShortcut && (
        <div className="px-3 py-1 bg-[#0b0e11] rounded-lg border border-[#1f242c] flex justify-center items-center gap-2.5 select-none">
          <span className="text-[#9EA5B5] text-xs font-medium font-satoshi leading-none uppercase tracking-[0.18em]">
            Ctrl / Cmd + K
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;






