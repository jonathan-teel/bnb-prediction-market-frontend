"use client";

import { BrowserProvider } from "ethers";

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

type WalletConnection = {
  provider: BrowserProvider;
  address: string;
  chainId: string;
};

export type SignaturePayload = {
  signature: string;
  address: string;
  chainId: string;
  message: string;
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

const signMessage = async (message: string): Promise<SignaturePayload> => {
  const { provider, address, chainId } = await ensureWalletConnection();
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(message);

  return {
    signature,
    address,
    chainId,
    message,
  };
};

export const depositLiquidity = async ({
  amount,
  marketId,
}: {
  amount: number;
  marketId: string;
}): Promise<SignaturePayload> => {
  const message = [
    "Prediction Market Liquidity Deposit",
    `Market: ${marketId}`,
    `Amount (BNB): ${amount}`,
    `Timestamp: ${Date.now()}`,
  ].join("\n");

  return signMessage(message);
};

export const marketBetting = async ({
  marketId,
  outcome,
  amount,
}: {
  marketId: string;
  outcome: "YES" | "NO";
  amount: number;
}): Promise<SignaturePayload> => {
  const message = [
    "Prediction Market Bet",
    `Market: ${marketId}`,
    `Outcome: ${outcome}`,
    `Stake (BNB): ${amount}`,
    `Timestamp: ${Date.now()}`,
  ].join("\n");

  return signMessage(message);
};

export const ensureWallet = async () => ensureWalletConnection();
