"use client";

export type WalletType = "metamask" | "trustwallet";

export type EthereumProvider = {
  isMetaMask?: boolean;
  isTrust?: boolean;
  isTrustWallet?: boolean;
  providers?: EthereumProvider[];
  request: (args: {
    method: string;
    params?: unknown[] | Record<string, unknown>;
  }) => Promise<unknown>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
};

const WALLET_PRIORITY: WalletType[] = ["metamask", "trustwallet"];

const toProviderList = (ethereum?: EthereumProvider): EthereumProvider[] => {
  if (!ethereum) return [];
  if (Array.isArray(ethereum.providers) && ethereum.providers.length > 0) {
    return ethereum.providers;
  }
  return [ethereum];
};

const setIfAvailable = (
  target: Map<WalletType, EthereumProvider>,
  type: WalletType,
  provider?: EthereumProvider
) => {
  if (!provider) return;
  if (!target.has(type)) {
    target.set(type, provider);
  }
};

export const detectInjectedWallets = (): Map<WalletType, EthereumProvider> => {
  if (typeof window === "undefined") {
    return new Map();
  }

  const wallets = new Map<WalletType, EthereumProvider>();
  const globalWindow = window as typeof window & {
    ethereum?: EthereumProvider;
    trustwallet?: EthereumProvider;
  };

  toProviderList(globalWindow.ethereum).forEach((provider) => {
    if (provider?.isMetaMask) {
      setIfAvailable(wallets, "metamask", provider);
    }
    if ((provider as any)?.isTrust || (provider as any)?.isTrustWallet) {
      setIfAvailable(wallets, "trustwallet", provider);
    }
  });

  if (globalWindow.trustwallet) {
    setIfAvailable(wallets, "trustwallet", globalWindow.trustwallet);
  }

  return wallets;
};

type ResolvedProvider =
  | {
      provider: EthereumProvider;
      walletType: WalletType;
    }
  | {
      provider: null;
      walletType: WalletType | null;
    };

export const resolveWalletProvider = (
  preferred?: WalletType | null
): ResolvedProvider => {
  const available = detectInjectedWallets();
  const preferenceOrder = preferred
    ? ([preferred, ...WALLET_PRIORITY.filter((item) => item !== preferred)] as WalletType[])
    : WALLET_PRIORITY;

  for (const wallet of preferenceOrder) {
    const provider = available.get(wallet);
    if (provider) {
      return { provider, walletType: wallet };
    }
  }

  return { provider: null, walletType: preferred ?? null };
};

export const getAvailableWalletTypes = (): WalletType[] =>
  Array.from(detectInjectedWallets().keys());

export const isMobileBrowser = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
};

const buildMetaMaskDeepLink = (url: string): string => {
  try {
    const { host, pathname, search, hash } = new URL(url);
    return `https://metamask.app.link/dapp/${host}${pathname}${search}${hash}`;
  } catch (error) {
    console.error("Failed to construct MetaMask deep link:", error);
    return "https://metamask.app.link";
  }
};

const buildTrustWalletDeepLink = (url: string): string => {
  const encodedUrl = encodeURIComponent(url);
  return `https://link.trustwallet.com/open_url?coin_id=60&url=${encodedUrl}`;
};

export const openWalletDeepLink = (wallet: WalletType) => {
  if (typeof window === "undefined") return;
  const currentUrl = window.location.href;

  const deepLink =
    wallet === "metamask"
      ? buildMetaMaskDeepLink(currentUrl)
      : buildTrustWalletDeepLink(currentUrl);

  window.location.href = deepLink;
};

export const readPreferredWallet = (): WalletType | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem("preferredWallet");
    if (stored === "metamask" || stored === "trustwallet") {
      return stored;
    }
  } catch (error) {
    console.warn("Unable to read preferred wallet from storage:", error);
  }
  return null;
};

export const writePreferredWallet = (wallet: WalletType | null) => {
  if (typeof window === "undefined") return;
  try {
    if (wallet) {
      window.localStorage.setItem("preferredWallet", wallet);
    } else {
      window.localStorage.removeItem("preferredWallet");
    }
  } catch (error) {
    console.warn("Unable to persist preferred wallet selection:", error);
  }
};

const ensureStringArray = (value: unknown, errorMessage: string): string[] => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(errorMessage);
  }
  return value as string[];
};

const ensureString = (value: unknown, errorMessage: string): string => {
  if (typeof value !== "string") {
    throw new Error(errorMessage);
  }
  return value;
};

export const requestAccounts = async (
  provider: EthereumProvider
): Promise<string[]> => {
  const result = await provider.request({ method: "eth_requestAccounts" });
  return ensureStringArray(result, "No account returned from wallet.");
};

export const listAuthorizedAccounts = async (
  provider: EthereumProvider
): Promise<string[]> => {
  const result = await provider.request({ method: "eth_accounts" });
  return ensureStringArray(result, "Failed to read authorized wallet accounts.");
};

export const requestChainId = async (
  provider: EthereumProvider
): Promise<string> => {
  const result = await provider.request({ method: "eth_chainId" });
  return ensureString(result, "Wallet returned an invalid chain id.");
};
