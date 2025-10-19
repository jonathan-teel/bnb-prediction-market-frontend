"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import Icon from "@/components/elements/Icons";
import { useGlobalContext } from "@/providers/GlobalContext";

const WalletMultiButtonDynamic = dynamic(
  async () => {
    const mod = await import("@solana/wallet-adapter-react-ui");
    return mod.WalletMultiButton;
  },
  { ssr: false }
);

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Markets", href: "/" },
  { label: "Fund", href: "/fund" },
  { label: "Create", href: "/propose" },
  { label: "Referral", href: "/referral" },
  { label: "Profile", href: "/profile" },
  { label: "About", href: "/about" },
];

const HeaderTop: React.FC = () => {
  const { activeTab, setActiveTab } = useGlobalContext();
  const pathname = usePathname();
  const { connected } = useWallet();

  const walletBtnClass = useMemo(
    () => (connected ? "bnb-wallet-btn" : "bnb-wallet-btn wallet-disconnected"),
    [connected]
  );

  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-40 w-full px-6 sm:px-10 lg:px-16 pt-6">
      <div className="rounded-3xl border border-[#1f242c] bg-[#11161c]/85 backdrop-blur-md px-6 sm:px-8 py-4 shadow-[0_24px_52px_-36px_rgba(6,12,20,0.85)]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2a313a]/70 bg-[#0b0e11] shadow-[0_18px_36px_-24px_rgba(240,185,11,0.75)]">
                <Icon name="Logo" size={26} />
              </span>
              <span className="hidden sm:flex flex-col">
                <span className="text-xs uppercase tracking-[0.4em] text-[#FCD535]/90">
                  Bnb
                </span>
                <span className="text-lg font-semibold tracking-[0.28em] text-white">
                  Predection
                </span>
                <span className="text-[10px] uppercase tracking-[0.32em] text-[#9EA5B5]/70">
                  Market
                </span>
              </span>
              <span className="sm:hidden text-sm uppercase tracking-[0.35em] text-white">
                BNBPM
              </span>
            </Link>

            <nav className="flex flex-1 justify-center overflow-x-auto whitespace-nowrap gap-2 text-sm font-medium uppercase tracking-[0.2em] text-[#9EA5B5]">
              {NAV_LINKS.map((link) => {
                const isActive = link.href === "/" ? pathname === link.href : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-[#181a20] text-white border border-[#fcd535]/40 shadow-[0_16px_32px_-28px_rgba(240,185,11,0.6)]"
                        : "border border-transparent hover:border-[#2a313a] hover:bg-[#15191f] hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-transparent bg-[#181a20] px-4 py-2.5 transition-all duration-300 hover:border-[#2a313a] hover:bg-[#15191f] cursor-pointer">
                <span className="text-white text-lg font-medium font-satoshi leading-7 transition-all duration-300 hover:text-[#FCD535]">
                  EN
                </span>
                <Icon name="Down" className="transition-transform duration-300 hover:rotate-180" />
              </div>
              <WalletMultiButtonDynamic className={walletBtnClass} />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 rounded-2xl border border-[#1f242c] bg-[#1a1f26] px-4 py-3">
            <span className="pointer-events-none">
              <Icon name="Search" />
            </span>
            <input
              type="text"
              placeholder="Search markets, creators, feeds"
              className="flex-1 bg-transparent text-[#9EA5B5] text-base font-medium font-satoshi leading-normal outline-none placeholder:text-[#5f6b7a]"
            />
            <div className="px-3 py-1 bg-[#11161c] rounded-lg border border-[#1f242c]">
              <span className="text-[#9EA5B5] text-xs font-medium font-satoshi uppercase tracking-[0.18em]">
                Ctrl / Cmd + K
              </span>
            </div>
          </div>

          {isHome && (
            <div className="flex items-center gap-2 rounded-[18px] border border-[#1f242c] bg-[#11161c] p-1">
              {(["ACTIVE", "PENDING"] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all duration-300 ${
                      isActive
                        ? "bg-[#181a20] text-white shadow-[inset_0px_2px_0px_0px_rgba(55,55,55,0.45)]"
                        : "bg-transparent text-[#9EA5B5] hover:bg-[#15191f] hover:shadow-md hover:scale-95"
                    }`}
                  >
                    <Icon
                      name={tab === "ACTIVE" ? "ActiveMarket" : "PendingMarket"}
                      color={isActive ? "#FCD535" : "#9EA5B5"}
                      className="transition-transform duration-300 ease-in-out hover:scale-110"
                    />
                    <span className="text-sm font-medium font-satoshi tracking-[0.18em] uppercase">
                      {tab === "ACTIVE" ? "Active" : "Pending"} Market
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="lg:hidden flex items-center gap-3 rounded-2xl border border-[#1f242c] bg-[#1a1f26] px-4 py-3">
            <span className="cursor-pointer">
              <Icon name="Search" />
            </span>
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent text-[#9EA5B5] text-sm font-medium font-satoshi leading-normal outline-none placeholder:text-[#5f6b7a]"
            />
            <div className="px-3 py-1 bg-[#11161c] rounded-lg border border-[#1f242c]">
              <span className="text-[#9EA5B5] text-xs font-medium font-satoshi uppercase tracking-[0.18em]">
                Ctrl / Cmd + K
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderTop;
