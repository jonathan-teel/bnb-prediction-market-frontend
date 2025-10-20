"use client";

import { BrowserProvider, formatEther } from "ethers";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  EthereumProvider,
  WalletType,
  getAvailableWalletTypes,
  isMobileBrowser,
  openWalletDeepLink,
  readPreferredWallet,
  resolveWalletProvider,
  listAuthorizedAccounts,
  requestAccounts,
  requestChainId,
  writePreferredWallet,
} from "@/utils/wallets";
import { TARGET_CHAIN_ID, TARGET_NETWORK } from "@/config/network";

type WalletContextValue = {
  address: string | null;
  connected: boolean;
  isConnecting: boolean;
  chainId: string | null;
  balance: string | null;
  connect: (wallet?: WalletType) => Promise<void>;
  disconnect: () => void;
  provider: BrowserProvider | null;
  isMetaMask: boolean;
  walletType: WalletType | null;
  availableWallets: WalletType[];
  targetChainId: string;
  switchToBnbChain: (desiredChainId?: string) => Promise<void>;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const providerRef = useRef<EthereumProvider | null>(null);
  const [eventProvider, setEventProvider] = useState<EthereumProvider | null>(null);

  const availableWallets = useMemo(() => {
    if (typeof window === "undefined") return [];
    return getAvailableWalletTypes();
  }, [provider, walletType, isConnecting]);

  const isMetaMask = walletType === "metamask";

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
    setWalletType(null);
    providerRef.current = null;
    setEventProvider(null);
    writePreferredWallet(null);
  }, []);

  const ensureProvider = useCallback(
    async (preferred?: WalletType) => {
      const storedPreference = readPreferredWallet();
      const requestedPreference = preferred ?? storedPreference ?? null;
      const { provider: injectedProvider, walletType: resolvedType } = resolveWalletProvider(requestedPreference);

      if (!injectedProvider || !resolvedType) {
        if (isMobileBrowser()) {
          openWalletDeepLink(preferred ?? "metamask");
        }
        throw new Error("MetaMask or Trust Wallet is not available in this browser.");
      }

      const browserProvider = new BrowserProvider(injectedProvider as any, "any");
      setProvider(browserProvider);
      setWalletType(resolvedType);
      providerRef.current = injectedProvider;
      setEventProvider(injectedProvider);
      writePreferredWallet(resolvedType);

      return { browserProvider, injectedProvider, resolvedType };
    },
    []
  );

  const connect = useCallback(
    async (preferredWallet?: WalletType) => {
      if (isConnecting) return;
      setIsConnecting(true);
      try {
        const { browserProvider, resolvedType } = await ensureProvider(preferredWallet);
        const ethereum = providerRef.current;
        if (!ethereum) {
          throw new Error("Wallet provider unavailable after initialization.");
        }
        const accounts = await requestAccounts(ethereum);
        const currentChainId = await requestChainId(ethereum);

        setAddress(accounts[0]);
        setChainId(currentChainId);
        setWalletType(resolvedType ?? null);

        await refreshBalance(browserProvider, accounts[0]);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        disconnect();
        throw error;
      } finally {
        setIsConnecting(false);
      }
    },
    [disconnect, ensureProvider, isConnecting, refreshBalance]
  );

  const switchToBnbChain = useCallback(
    async (desiredChainId: string = TARGET_CHAIN_ID) => {
      const ethereum =
        providerRef.current ??
        resolveWalletProvider(walletType ?? undefined).provider;
      if (!ethereum) {
        if (isMobileBrowser()) {
          openWalletDeepLink(walletType ?? "metamask");
        }
        throw new Error("No wallet provider available.");
      }

      const currentChainId: string = await requestChainId(ethereum);
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
                chainName: TARGET_NETWORK.chainName,
                nativeCurrency: TARGET_NETWORK.nativeCurrency,
                rpcUrls: TARGET_NETWORK.rpcUrls,
                blockExplorerUrls: TARGET_NETWORK.blockExplorerUrls,
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
    [walletType]
  );

  useEffect(() => {
    if (!eventProvider) return;

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

    eventProvider.on?.("accountsChanged", handleAccountsChanged);
    eventProvider.on?.("chainChanged", handleChainChanged);

    return () => {
      eventProvider.removeListener?.("accountsChanged", handleAccountsChanged);
      eventProvider.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [address, disconnect, eventProvider, provider, refreshBalance]);

  useEffect(() => {
    // Attempt to eagerly connect if the wallet was previously authorized.
    (async () => {
      const storedPreference = readPreferredWallet();
      const { provider: injectedProvider } = resolveWalletProvider(storedPreference);
      if (!injectedProvider) return;
      try {
        const accounts = await listAuthorizedAccounts(injectedProvider);
        if (accounts.length) {
          const { browserProvider, resolvedType } = await ensureProvider(storedPreference ?? undefined);
          setAddress(accounts[0]);
          const currentChainId = await requestChainId(injectedProvider);
          setChainId(currentChainId);
          setWalletType(resolvedType ?? null);
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
      walletType,
      targetChainId: TARGET_CHAIN_ID,
      availableWallets,
      switchToBnbChain,
    }),
    [
      address,
      availableWallets,
      balance,
      chainId,
      connect,
      disconnect,
      isConnecting,
      isMetaMask,
      provider,
      switchToBnbChain,
      walletType,
    ]
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
