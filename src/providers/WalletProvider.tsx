"use client";

import {
  BrowserProvider,
  formatEther,
} from "ethers";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type EthereumProvider = {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
};

type WalletContextValue = {
  address: string | null;
  connected: boolean;
  isConnecting: boolean;
  chainId: string | null;
  balance: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: BrowserProvider | null;
  isMetaMask: boolean;
  switchToBnbChain: (desiredChainId?: string) => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

const DEFAULT_BNB_CHAIN_ID = "0x38"; // BNB Smart Chain Mainnet

const getEthereum = (): EthereumProvider | undefined => {
  if (typeof window === "undefined") return undefined;
  return (window as typeof window & { ethereum?: EthereumProvider }).ethereum;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const isMetaMask = Boolean(getEthereum()?.isMetaMask);

  const refreshBalance = useCallback(
    async (providerInstance: BrowserProvider | null, walletAddress: string | null) => {
      if (!providerInstance || !walletAddress) {
        setBalance(null);
        return;
      }
      try {
        const rawBalance = await providerInstance.getBalance(walletAddress);
        setBalance(formatEther(rawBalance));
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
        setBalance(null);
      }
    },
    []
  );

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setBalance(null);
    setProvider(null);
  }, []);

  const ensureProvider = useCallback(async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      throw new Error("MetaMask (or another EVM wallet) is not available in this browser.");
    }
    const browserProvider = new BrowserProvider(ethereum as any, "any");
    setProvider(browserProvider);
    return browserProvider;
  }, []);

  const connect = useCallback(async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      const browserProvider = await ensureProvider();
      const ethereum = getEthereum();
      if (!ethereum) {
        throw new Error("MetaMask provider unavailable after initialization.");
      }
      const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" });
      if (!accounts || accounts.length === 0) {
        throw new Error("No account returned from wallet.");
      }
      const currentChainId: string = await ethereum.request({ method: "eth_chainId" });

      setAddress(accounts[0]);
      setChainId(currentChainId);

      await refreshBalance(browserProvider, accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      disconnect();
    } finally {
      setIsConnecting(false);
    }
  }, [disconnect, ensureProvider, isConnecting, refreshBalance]);

  const switchToBnbChain = useCallback(
    async (desiredChainId: string = DEFAULT_BNB_CHAIN_ID) => {
      const ethereum = getEthereum();
      if (!ethereum) {
        throw new Error("MetaMask is not available.");
      }

      const currentChainId: string = await ethereum.request({ method: "eth_chainId" });
      if (currentChainId === desiredChainId) {
        setChainId(currentChainId);
        return;
      }

      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: desiredChainId }],
        });
        setChainId(desiredChainId);
      } catch (switchError: any) {
        if (switchError?.code === 4902) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: desiredChainId,
                chainName: "BNB Smart Chain",
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                rpcUrls: ["https://bsc-dataseed.binance.org"],
                blockExplorerUrls: ["https://bscscan.com"],
              },
            ],
          });
          setChainId(desiredChainId);
        } else {
          console.error("Failed to switch network:", switchError);
          throw switchError;
        }
      }
    },
    []
  );

  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0]);
        refreshBalance(provider, accounts[0]).catch((error) => {
          console.error("Failed to refresh balance after account change:", error);
        });
      }
    };

    const handleChainChanged = (nextChainId: string) => {
      setChainId(nextChainId);
      refreshBalance(provider, address).catch((error) => {
        console.error("Failed to refresh balance after chain change:", error);
      });
    };

    ethereum.on?.("accountsChanged", handleAccountsChanged);
    ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [address, disconnect, provider, refreshBalance]);

  useEffect(() => {
    // Attempt to eagerly connect if the wallet was previously authorized.
    (async () => {
      const ethereum = getEthereum();
      if (!ethereum) return;
      try {
        const accounts: string[] = await ethereum.request({ method: "eth_accounts" });
        if (accounts?.length) {
          const browserProvider = await ensureProvider();
          setAddress(accounts[0]);
          const currentChainId: string = await ethereum.request({ method: "eth_chainId" });
          setChainId(currentChainId);
          await refreshBalance(browserProvider, accounts[0]);
        }
      } catch (error) {
        console.warn("Eager wallet connection failed:", error);
      }
    })();
  }, [ensureProvider, refreshBalance]);

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      connected: Boolean(address),
      isConnecting,
      chainId,
      balance,
      connect,
      disconnect,
      provider,
      isMetaMask,
      switchToBnbChain,
    }),
    [address, balance, chainId, connect, disconnect, isConnecting, isMetaMask, provider, switchToBnbChain]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
