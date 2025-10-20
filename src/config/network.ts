"use client";

export type NetworkMetadata = {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

const fallbackTestnetRpc = "https://data-seed-prebsc-1-s1.binance.org:8545";
const fallbackMainnetRpc = "https://bsc-dataseed.binance.org";

const BSC_MAINNET: NetworkMetadata = {
  chainId: "0x38",
  chainName: "BNB Smart Chain",
  rpcUrls: [fallbackMainnetRpc],
  blockExplorerUrls: ["https://bscscan.com"],
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
};

const BSC_TESTNET: NetworkMetadata = {
  chainId: "0x61",
  chainName: "BNB Smart Chain Testnet",
  rpcUrls: [fallbackTestnetRpc],
  blockExplorerUrls: ["https://testnet.bscscan.com"],
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
};

const resolveEnv = (key: string): string | undefined => {
  if (typeof process === "undefined" || !process.env) return undefined;
  const value = process.env[key];
  return value && value.length > 0 ? value : undefined;
};

const envChainId = resolveEnv("NEXT_PUBLIC_CHAIN_ID")?.toLowerCase();
const envRpcUrl = resolveEnv("NEXT_PUBLIC_RPC_URL");

const NETWORK_MAP: Record<string, NetworkMetadata> = {
  [BSC_MAINNET.chainId]: BSC_MAINNET,
  [BSC_TESTNET.chainId]: BSC_TESTNET,
};

export const TARGET_CHAIN_ID = (envChainId ?? BSC_TESTNET.chainId).toLowerCase();

const baseMetadata = NETWORK_MAP[TARGET_CHAIN_ID] ?? BSC_TESTNET;

export const TARGET_NETWORK: NetworkMetadata = {
  ...baseMetadata,
  rpcUrls:
    envRpcUrl && envRpcUrl.length > 0
      ? [envRpcUrl]
      : baseMetadata.rpcUrls,
};

export const TARGET_CHAIN_DEC = parseInt(TARGET_CHAIN_ID, 16);
