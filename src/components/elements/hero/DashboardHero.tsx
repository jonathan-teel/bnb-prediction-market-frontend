"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useGlobalContext } from "@/providers/GlobalContext";
import { formatTokenAmount } from "@/utils";

interface NetworkStats {
  price: number | null;
  change24h: number | null;
}

const formatCurrency = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return "-";
  return `$${value.toFixed(2)}`;
};

const DashboardHero: React.FC = () => {
  const { markets } = useGlobalContext();
  const [networkStats, setNetworkStats] = useState<NetworkStats>({ price: null, change24h: null });
  const [isLoading, setIsLoading] = useState(false);

  const totalMarkets = markets.length;
  const totalTreasury = useMemo(() => {
    return markets.reduce((acc, market) => acc + (Number(market.totalInvestment) || 0), 0);
  }, [markets]);

  useEffect(() => {
    const fetchPrice = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BNBUSDT");
        const data = await response.json();
        const price = parseFloat(data?.lastPrice ?? "0");
        const change = parseFloat(data?.priceChangePercent ?? "0");
        setNetworkStats({ price, change24h: change });
      } catch (error) {
        console.error("Failed to fetch BNB price", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[color:var(--border-soft)] bg-[linear-gradient(140deg,rgba(18,27,44,0.82),rgba(6,10,18,0.94))] px-6 py-10 shadow-bnb-card sm:px-10 lg:px-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(252,213,53,0.08),transparent_65%)] opacity-80" />
        <div className="absolute -left-24 top-[-18%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(252,213,53,0.22),transparent_60%)] blur-[120px]" />
        <div className="absolute right-[-10%] top-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(44,64,96,0.35),transparent_70%)] blur-[150px]" />
      </div>

      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.38em] text-primary-soft opacity-90">
              Live on BNB Smart Chain
            </span>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Predict the future with the crowd.
              <br className="hidden sm:block" /> Fuel markets with BNB in seconds.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[color:var(--text-muted)] sm:text-lg">
              Launch new markets, back your convictions, and earn yield in a non-custodial prediction protocol designed for the BNB ecosystem.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/propose" className="btn-primary shadow-bnb-glow">
              Create Market
            </Link>
            <Link
              href="/fund"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/0 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--text-muted)] transition-all duration-300 hover:border-primary/40 hover:bg-white/5 hover:text-white"
            >
              Explore Markets
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-primary/50 bg-white/5 text-xs text-primary">
                &gt;
              </span>
            </Link>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--border-soft)] bg-[rgba(13,20,34,0.88)] px-5 py-4 shadow-bnb-card">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(252,213,53,0.14),transparent_68%)] opacity-80" />
            <span className="text-xs uppercase tracking-[0.32em] text-[color:var(--text-soft)]">BNB Price</span>
            <div className="mt-2 flex items-baseline gap-2 text-white">
              <span className="text-2xl font-semibold">
                {isLoading ? "." : formatCurrency(networkStats.price)}
              </span>
              <span
                className={`text-xs font-medium ${(networkStats.change24h ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {networkStats.change24h !== null ? `${networkStats.change24h.toFixed(2)}%` : "-"}
              </span>
            </div>
            <p className="mt-1 text-xs text-[color:var(--text-soft)]">24h change</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--border-soft)] bg-[rgba(13,20,34,0.88)] px-5 py-4 shadow-bnb-card">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(252,213,53,0.1),transparent_70%)] opacity-60" />
            <span className="text-xs uppercase tracking-[0.32em] text-[color:var(--text-soft)]">Total Markets</span>
            <div className="mt-2 text-2xl font-semibold text-white">{totalMarkets}</div>
            <p className="mt-1 text-xs text-[color:var(--text-soft)]">Live + settling</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--border-soft)] bg-[rgba(13,20,34,0.88)] px-5 py-4 shadow-bnb-card">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(252,213,53,0.1),transparent_70%)] opacity-60" />
            <span className="text-xs uppercase tracking-[0.32em] text-[color:var(--text-soft)]">Treasury Value</span>
            <div className="mt-2 text-2xl font-semibold text-white">
              {formatTokenAmount(totalTreasury, 0, "BNB", 2)}
            </div>
            <p className="mt-1 text-xs text-[color:var(--text-soft)]">Aggregated liquidity & stakes</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardHero;
