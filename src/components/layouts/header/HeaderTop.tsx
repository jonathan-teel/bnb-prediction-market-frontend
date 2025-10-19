"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import Icon from "@/components/elements/Icons";
import { useGlobalContext } from "@/providers/GlobalContext";
import { useWallet } from "@/providers/WalletProvider";
import { shortenAddress } from "@/utils";
import type { WalletType } from "@/utils/wallets";

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
  const {
    connected,
    isConnecting,
    connect,
    disconnect,
    address,
    chainId,
    switchToBnbChain,
    walletType,
    availableWallets,
  } = useWallet();
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const walletMenuRef = useRef<HTMLDivElement | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuInnerRef = useRef<HTMLDivElement | null>(null);

  const isOnBnbChain = chainId === null || chainId?.toLowerCase() === "0x38";

  const walletBtnClass = useMemo(
    () =>
      connected
        ? "bnb-wallet-btn"
        : "bnb-wallet-btn wallet-disconnected",
    [connected]
  );

  useEffect(() => {
    if (connected) {
      setWalletMenuOpen(false);
    }
  }, [connected]);

  useEffect(() => {
    if (!walletMenuOpen) return;
    const handlePointerAway = (event: PointerEvent) => {
      if (!walletMenuRef.current?.contains(event.target as Node)) {
        setWalletMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerAway);
    return () => {
      document.removeEventListener("pointerdown", handlePointerAway);
    };
  }, [walletMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handlePointerAway = (event: PointerEvent) => {
      if (!mobileMenuInnerRef.current?.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerAway);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerAway);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  const handleWalletClick = async () => {
    try {
      if (connected) {
        disconnect();
      } else {
        setWalletMenuOpen((prev) => !prev);
      }
    } catch (error) {
      console.error("Wallet action failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setWalletMenuOpen(false);
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSwitchNetwork = async () => {
    try {
      await switchToBnbChain();
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  const handleSelectWallet = async (type: WalletType) => {
    setWalletMenuOpen(false);
    try {
      await connect(type);
    } catch (error) {
      console.error(`Failed to connect with ${type}:`, error);
    }
  };

  const walletLabel = connected
    ? shortenAddress(address ?? "")
    : isConnecting
      ? "Connecting..."
      : "Connect Wallet";

  const walletOptions = useMemo(
    () =>
      ([
        {
          type: "metamask",
          label: "MetaMask",
          hint: "Browser extension & mobile app",
        },
        {
          type: "trustwallet",
          label: "Trust Wallet",
          hint: "Extension, mobile deep link",
        },
      ] as const).map((option) => ({
        ...option,
        supported: availableWallets.includes(option.type),
      })),
    [availableWallets]
  );

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

            <nav className="hidden flex-1 justify-center overflow-x-auto whitespace-nowrap gap-2 text-sm font-medium uppercase tracking-[0.2em] text-[#9EA5B5] lg:flex">
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
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1f242c] bg-[#15191f] transition-all duration-300 hover:border-[#2a313a] hover:bg-[#181d25] lg:hidden"
                aria-label="Toggle navigation menu"
              >
                <span className="flex flex-col items-center justify-center gap-[6px]">
                  <span
                    className={`block h-0.5 w-6 rounded-full bg-white transition-transform duration-300 ${
                      isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-6 rounded-full bg-white transition-opacity duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-6 rounded-full bg-white transition-transform duration-300 ${
                      isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                    }`}
                  />
                </span>
              </button>
              <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-transparent bg-[#181a20] px-4 py-2.5 transition-all duration-300 hover:border-[#2a313a] hover:bg-[#15191f] cursor-pointer">
                <span className="text-white text-lg font-medium font-satoshi leading-7 transition-all duration-300 hover:text-[#FCD535]">
                  EN
                </span>
                <Icon name="Down" className="transition-transform duration-300 hover:rotate-180" />
              </div>
              <div className="relative" ref={walletMenuRef}>
                <button
                  type="button"
                  onClick={handleWalletClick}
                  className={walletBtnClass}
                  disabled={isConnecting}
                >
                  {walletLabel}
                </button>
                {!connected && walletMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#1f242c] bg-[#11161c]/95 p-3 shadow-[0_18px_48px_-24px_rgba(6,12,20,0.85)] backdrop-blur">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#9EA5B5]">
                      Select Wallet
                    </p>
                    <div className="flex flex-col gap-2">
                      {walletOptions.map((option) => {
                        const isSelected = walletType === option.type;
                        return (
                          <button
                            key={option.type}
                            type="button"
                            onClick={() => handleSelectWallet(option.type)}
                            className={`flex w-full flex-col items-start rounded-xl border px-3 py-2 text-left transition-all duration-300 ${
                              isSelected
                                ? "border-[#fcd535]/60 bg-[#181a20]"
                                : "border-transparent bg-[#15191f] hover:border-[#2a313a] hover:bg-[#181d25]"
                            }`}
                          >
                            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                              {option.label}
                            </span>
                            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9EA5B5]">
                              {option.hint}
                            </span>
                            {!option.supported && (
                              <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#fcd535]/80">
                                Opens wallet app if needed
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isOnBnbChain && (
            <div className="flex items-center gap-3 rounded-2xl border border-[#f87171]/40 bg-[#3a1f1f]/60 px-4 py-3 text-sm text-white">
              <span className="font-semibold uppercase tracking-[0.18em]">Network mismatch</span>
              <button
                type="button"
                onClick={handleSwitchNetwork}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition hover:bg-white/20"
              >
                Switch to BNB
              </button>
            </div>
          )}

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
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="absolute inset-0 z-0 bg-black/40"
            aria-label="Close navigation overlay"
            onClick={closeMobileMenu}
          />
          <div
            className="relative z-10 ml-auto flex h-full w-72 max-w-[85%] flex-col rounded-l-3xl border border-[#1f242c] bg-[#0d1117]/95 p-6 shadow-[0_24px_72px_-32px_rgba(8,12,20,0.95)]"
            ref={mobileMenuInnerRef}
          >
            <div className="flex items-center justify-between">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#2a313a]/70 bg-[#0b0e11]">
                  <Icon name="Logo" size={22} />
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white">
                  BNBPM
                </span>
              </Link>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent bg-[#15191f] transition-all duration-300 hover:border-[#2a313a] hover:bg-[#181d25]"
                aria-label="Close navigation menu"
              >
                <span className="relative block h-4 w-4">
                  <span className="absolute inset-0 block h-0.5 w-full rotate-45 bg-white" />
                  <span className="absolute inset-0 block h-0.5 w-full -rotate-45 bg-white" />
                </span>
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9EA5B5]">
              {NAV_LINKS.map((link) => {
                const isActive = link.href === "/" ? pathname === link.href : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`rounded-2xl border px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? "border-[#fcd535]/40 bg-[#181a20] text-white shadow-[0_12px_24px_-20px_rgba(240,185,11,0.6)]"
                        : "border-transparent bg-[#15191f] hover:border-[#2a313a] hover:bg-[#181d25] hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto flex flex-col gap-3 pt-8">
              {!connected && (
                <button
                  type="button"
                  className="w-full rounded-2xl border border-[#fcd535]/50 bg-[#181a20] px-4 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#1f242c]"
                  onClick={() => {
                    closeMobileMenu();
                    setWalletMenuOpen(true);
                  }}
                >
                  Connect Wallet
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  void handleSwitchNetwork();
                }}
                className="w-full rounded-2xl border border-[#1f242c] bg-[#15191f] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9EA5B5] transition hover:border-[#2a313a] hover:bg-[#181d25] hover:text-white"
              >
                Switch To BNB
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderTop;
