import { useGlobalContext } from "@/providers/GlobalContext";
import { useEffect, useState } from "react";
import { categories } from "@/data/data";
import Pagination from "../pagination/Pagination";
import PredictionCard from "./PredictionCard";
import PendingCard from "./PendingCard";
import Navbar from "../Navbar";
import axios, { AxiosResponse } from "axios";
import { usePathname } from "next/navigation";
import { API_BASE_URL } from "@/config/api";

interface MarketProps {
  showRecentActivity?: boolean;
  onToggleRecentActivity?: () => void;
}

const Market: React.FC<MarketProps> = ({ showRecentActivity = true, onToggleRecentActivity }) => {
  const { markets, activeTab, formatMarketData } = useGlobalContext();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("Trending");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      let marketData: AxiosResponse<any, any> = {
        data: undefined,
        status: 0,
        statusText: "",
        headers: {},
        config: {
          headers: new axios.AxiosHeaders()
        }
      };
      const fieldQuery = selectedCategory === "Sports" ? 1 : 0;
      if (pathname === "/fund") {
        marketData = await axios.get(
          `${API_BASE_URL}/market/get?page=${currentPage}&limit=10&marketStatus=PENDING&marketField=${fieldQuery}`
        );
      } else if (pathname === "/") {
        marketData = await axios.get(
          `${API_BASE_URL}/market/get?page=${currentPage}&limit=10&marketStatus=ACTIVE&marketField=${fieldQuery}`
        );
      }

      if (marketData.data?.total !== undefined) {
        setTotal(marketData.data.total);
      }
      if (Array.isArray(marketData.data?.data)) {
        formatMarketData(marketData.data.data);
      } else {
        formatMarketData([]);
      }
    })()
  }, [pathname, selectedCategory, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  // Filter markets based on selected category
  const filteredMarkets = markets.filter(market => {
    if (selectedCategory === "Trending") {
      return true; // Show all markets in Trending
    } else if (selectedCategory === "Sports") {
      return market.marketField === 1; // Show sports markets
    } else if (selectedCategory === "Crypto") {
      return market.marketField === 0 && market.task === "price"; // Show crypto markets
    } else if (selectedCategory === "News") {
      return market.marketField === 0 && market.task !== "price"; // Show news markets
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(total / 10));

  return (
    <div className="flex-1 flex w-full flex-col self-stretch justify-start items-start gap-6">
      <Navbar 
        categories={categories} 
        onCategorySelect={handleCategorySelect} 
        showRecentActivity={showRecentActivity}
        onToggleRecentActivity={onToggleRecentActivity}
      />
      <div className={`grid w-full grid-cols-1 gap-4 ${
        pathname === "/fund" 
          ? "md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3" 
          : showRecentActivity
            ? "md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
            : "md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
      }`}>
        {filteredMarkets.map((prediction, index) =>
          activeTab === "ACTIVE" ? (
            <PredictionCard
              key={prediction._id}
              index={markets.indexOf(prediction)}
              currentPage={currentPage}
            />
          ) : (
            <PendingCard
              key={prediction._id}
              index={markets.indexOf(prediction)}
              category={prediction.feedName}
              question={prediction.question}
              imageUrl={prediction.imageUrl}
              volume={prediction.totalInvestment}
              timeLeft={prediction.date}
            />
          )
        )}
      </div>

      {total > 10 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Market;
