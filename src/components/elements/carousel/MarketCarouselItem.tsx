import { MarketCarouselItemProps } from "@/types/type";
import { FaRegClock, FaRegStar } from "react-icons/fa6";
import { motion } from "framer-motion";

const MarketCarouselItem: React.FC<MarketCarouselItemProps> = ({
  category,
  title,
  bgImage,
  mainImage,
  overlayImage,
  volume,
  timeLeft,
  yesPercentage,
  comments,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full h-[180px] rounded-2xl cursor-pointer border border-[#1f242c] overflow-hidden carousel-item bg-[#181a20]/95 flex items-center px-4 py-3 transition-all duration-200 hover:shadow-[0_24px_40px_-28px_rgba(240,185,11,0.65)]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <img
          className="w-full h-full object-cover opacity-40"
          src={bgImage}
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0b0e11]/65 to-[#0b0e11]" />
      </div>

      {/* Main Image (subtle, right side) */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-[80px] h-[80px] hidden md:block opacity-80 z-10">
        <img
          className="w-full h-full object-contain"
          src={mainImage}
          alt="Main"
        />
      </div>

      {/* Overlay Image (optional, more subtle) */}
      <div className="absolute right-0 top-0 w-[60px] h-[60px] hidden lg:block opacity-40 z-10">
        <img
          className="w-full h-full object-contain"
          src={overlayImage}
          alt="Overlay"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-between items-start h-full w-[75%]">
        <div className="flex flex-col gap-2">
          {/* Category and Title */}
          <div className="flex items-center gap-2">
            <span className="text-[#FCD535] text-sm font-semibold uppercase tracking-[0.18em]">{category}</span>
            <div className="flex items-center gap-1">
              <FaRegStar className="text-[#9EA5B5] w-4 h-4" />
              <span className="text-[#9EA5B5] text-sm">{comments}</span>
            </div>
          </div>
          <div className="text-white text-xl font-bold font-rubik leading-tight line-clamp-2">
            {title}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[#9EA5B5] text-xs">Volume</span>
            <span className="text-white text-sm font-semibold">{volume}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#9EA5B5] text-xs">Time Left</span>
            <div className="flex items-center gap-1">
              <FaRegClock className="text-[#FCD535] w-3 h-3" />
              <span className="text-[#FCD535] text-sm font-semibold">{timeLeft}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[#9EA5B5] text-xs">Yes %</span>
            <span className="text-white text-sm font-semibold">{yesPercentage}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketCarouselItem;
