import { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import MarketCarouselItem from "./MarketCarouselItem";
import { useGlobalContext } from "@/providers/GlobalContext";
import { calculateYesPercentage, formatTokenAmount, getCountDown } from "@/utils";

const FALLBACK_IMAGE = "https://placehold.co/600x400/0b0e11/FFFFFF?text=BNB+Market";

const getCategoryLabel = (marketField?: number) => {
  if (marketField === 1) return "Sports";
  if (marketField === 2) return "News";
  return "Crypto";
};

const FILTERS = [
  { key: "top-volume", label: "Top Volume" },
  { key: "ending-soon", label: "Ending Soon" },
  { key: "new-listings", label: "New Listings" },
] as const;

const MarketCarousel = () => {
  const { markets } = useGlobalContext();
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]["key"]>("top-volume");

  const enrichedMarkets = useMemo(() => {
    return markets.map((market) => ({
      raw: market,
      category: getCategoryLabel(market.marketField),
      title: market.question ?? "Prediction market",
      bgImage: market.imageUrl || FALLBACK_IMAGE,
      mainImage: market.imageUrl || FALLBACK_IMAGE,
      overlayImage: market.imageUrl || FALLBACK_IMAGE,
      volumeValue: Number(market.totalInvestment) || 0,
      volume: formatTokenAmount(market.totalInvestment, 0),
      timeLeftLabel: market.date ? getCountDown(market.date) : "—",
      closingTime: market.date ? new Date(market.date).getTime() : Number.MAX_SAFE_INTEGER,
      createdAt: market.createdAt ? new Date(market.createdAt).getTime() : 0,
      yesPercentage: calculateYesPercentage(market.playerACount ?? 0, market.playerBCount ?? 0),
      comments: market.comments ?? 0,
    }));
  }, [markets]);

  const carouselItems = useMemo(() => {
    if (!enrichedMarkets.length) return [];

    let sorted = [...enrichedMarkets];
    if (activeFilter === "top-volume") {
      sorted.sort((a, b) => b.volumeValue - a.volumeValue);
    } else if (activeFilter === "ending-soon") {
      sorted.sort((a, b) => a.closingTime - b.closingTime);
    } else if (activeFilter === "new-listings") {
      sorted.sort((a, b) => b.createdAt - a.createdAt);
    }

    return sorted.slice(0, 9).map((item) => ({
      category: item.category,
      title: item.title,
      bgImage: item.bgImage,
      mainImage: item.mainImage,
      overlayImage: item.overlayImage,
      volume: item.volume,
      timeLeft: item.timeLeftLabel,
      yesPercentage: item.yesPercentage,
      comments: item.comments,
    }));
  }, [enrichedMarkets, activeFilter]);

  if (!carouselItems.length) {
    return (
      <div className="w-full rounded-2xl border border-[#1f242c] bg-[#11161c] px-6 py-10 text-center text-[#9EA5B5]">
        Featured markets will appear here once activity begins.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">Discover Markets</h2>
          <p className="text-sm text-[#5f6b7a]">Curated opportunities based on live activity</p>
        </div>
        <div className="flex gap-2 rounded-2xl border border-[#1f242c] bg-[#11161c] p-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                activeFilter === filter.key
                  ? "bg-[#181a20] text-white shadow-[0_18px_32px_-28px_rgba(240,185,11,0.5)]"
                  : "text-[#9EA5B5] hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <Carousel
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        centerMode={false}
        containerClass="container"
        draggable
        infinite={carouselItems.length > 2}
        itemClass="px-2"
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover
        responsive={{
          desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 1,
            partialVisibilityGutter: 40,
          },
          tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 1,
            partialVisibilityGutter: 30,
          },
          mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1,
            partialVisibilityGutter: 20,
          },
        }}
        showDots={false}
        swipeable
      >
        {carouselItems.map((item, index) => (
          <MarketCarouselItem key={`${item.title}-${index}`} {...item} />
        ))}
      </Carousel>
    </div>
  );
};

export default MarketCarousel;

