"use client";

import { BrowserProvider, Contract, parseEther } from "ethers";

import {
  WalletType,
  isMobileBrowser,
  openWalletDeepLink,
  readPreferredWallet,
  resolveWalletProvider,
  requestAccounts,
  requestChainId,
  writePreferredWallet,
} from "@/utils/wallets";
import {
  PREDICTION_MARKET_ABI,
  PREDICTION_MARKET_ADDRESS,
  TARGET_EXPLORER_BASE,
} from "@/config/predictionMarket";
import { TARGET_CHAIN_ID, TARGET_NETWORK } from "@/config/network";

type WalletConnection = {
  provider: BrowserProvider;
  address: string;
  chainId: string;
};

export type ContractTxResult = {
  hash: string;
  address: string;
  chainId: string;
  explorerUrl: string;
};

const ensureWalletConnection = async (
  preferredWallet?: WalletType
): Promise<WalletConnection> => {
  if (typeof window === "undefined") {
    throw new Error("Wallet connection is only available in the browser.");
  }

  const storedPreference = readPreferredWallet();
  const { provider: injectedProvider, walletType } = resolveWalletProvider(
    preferredWallet ?? storedPreference ?? undefined
  );

  if (!injectedProvider || !walletType) {
    if (isMobileBrowser()) {
      openWalletDeepLink(preferredWallet ?? "metamask");
    }
    throw new Error("MetaMask or Trust Wallet is not available.");
  }

  const provider = new BrowserProvider(injectedProvider as any, "any");

  const accounts = await requestAccounts(injectedProvider);
  const chainId = await requestChainId(injectedProvider);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  writePreferredWallet(walletType);

  return { provider, address, chainId };
};

const getContract = (provider: BrowserProvider) =>
  new Contract(PREDICTION_MARKET_ADDRESS, PREDICTION_MARKET_ABI, provider);

const assertTargetNetwork = (chainId: string) => {
  if (chainId.toLowerCase() !== TARGET_CHAIN_ID) {
    throw new Error(`Please switch your wallet to ${TARGET_NETWORK.chainName}.`);
  }
};

const normalizeMarketId = (marketId: string | number | bigint): bigint => {
  try {
    return BigInt(marketId);
  } catch (error) {
    throw new Error("Invalid market identifier supplied.");
  }
};

export const depositLiquidity = async ({
  amount,
  marketId,
  preferredWallet,
}: {
  amount: number;
  marketId: string | number | bigint;
  preferredWallet?: WalletType;
}): Promise<ContractTxResult> => {
  const { provider, address, chainId } = await ensureWalletConnection(preferredWallet);
  assertTargetNetwork(chainId);
  const signer = await provider.getSigner();
  const contract = getContract(provider).connect(signer);

  const normalizedAmount = parseEther(amount.toString());
  const normalizedMarketId = normalizeMarketId(marketId);

  const tx = await contract.provideLiquidity(normalizedMarketId, {
    value: normalizedAmount,
  });
  await tx.wait();

  return {
    hash: tx.hash,
    address,
    chainId,
    explorerUrl: `${TARGET_EXPLORER_BASE}${tx.hash}`,
  };
};

export const marketBetting = async ({
  marketId,
  outcome,
  amount,
  preferredWallet,
}: {
  marketId: string | number | bigint;
  outcome: "YES" | "NO";
  amount: number;
  preferredWallet?: WalletType;
}): Promise<ContractTxResult> => {
  const { provider, address, chainId } = await ensureWalletConnection(preferredWallet);
  assertTargetNetwork(chainId);
  const signer = await provider.getSigner();
  const contract = getContract(provider).connect(signer);

  const normalizedMarketId = normalizeMarketId(marketId);
  const stake = parseEther(amount.toString());

  const tx = await contract.placeBet(normalizedMarketId, outcome === "YES", {
    value: stake,
  });
  await tx.wait();

  return {
    hash: tx.hash,
    address,
    chainId,
    explorerUrl: `${TARGET_EXPLORER_BASE}${tx.hash}`,
  };
};

export const ensureWallet = async () => ensureWalletConnection();
