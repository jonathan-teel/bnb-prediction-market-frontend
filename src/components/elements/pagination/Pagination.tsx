"use client";

import React from "react";
import {
  MdKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";

interface PaginationProps {
  totalPages: number; // Total number of pages
  currentPage: number; // The current active page
  onPageChange: (page: number) => void; // Function to handle page change
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  // Generate an array of page numbers to display
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // Handle page click
  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="self-stretch flex w-full justify-center items-center gap-4">
      <div className="rounded-[18px] flex flex-wrap justify-center items-center sm:gap-6 gap-3">
        {/* Left Decoration */}
        <div className="sm:p-4 p-2 bg-[#181a20] rounded-2xl border border-[#1f242c] flex justify-center items-center shadow-[0_18px_34px_-28px_rgba(6,12,18,0.65)]">
          <div className="w-6 h-6 flex justify-center items-center">
            <MdOutlineKeyboardArrowLeft className="text-white text-lg" />
          </div>
        </div>

        {/* Pagination Items */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          {pageNumbers.map((page) => (
            <div
              key={page}
              data-active={currentPage === page ? "On" : "Off"}
              onClick={() => handlePageClick(page)}
              className={`sm:w-14 w-10 sm:p-4 p-2 rounded-2xl flex justify-center items-center gap-2 cursor-pointer transition-all duration-300 ${
                currentPage === page
                  ? "bg-[#181a20] border border-[#fcd535]/50 text-white shadow-[0_18px_32px_-28px_rgba(240,185,11,0.45)]"
                  : "bg-transparent border border-[#1f242c] text-[#9EA5B5] hover:border-[#2a313a] hover:bg-[#15191f]"
              }`}
            >
              <div className="text-current text-sm font-medium tracking-[0.18em] uppercase">
                {page}
              </div>
            </div>
          ))}
        </div>

        {/* Right Decoration */}
        <div className="sm:p-4 p-2 bg-[#181a20] rounded-2xl border border-[#1f242c] flex justify-center items-center shadow-[0_18px_34px_-28px_rgba(6,12,18,0.65)]">
          <div className="w-6 h-6 flex justify-center items-center">
            <MdKeyboardArrowRight className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

