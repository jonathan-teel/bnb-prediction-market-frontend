"use client";

import { BrowserProvider } from "ethers";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<any>;
    };
  }
}

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

const ensureWalletConnection = async (): Promise<WalletConnection> => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask (or another EVM-compatible wallet) is not available.");
  }

  const provider = new BrowserProvider(window.ethereum, "any");

  const accounts: string[] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  if (!accounts || accounts.length === 0) {
    throw new Error("No account returned from wallet.");
  }

  const chainId: string = await window.ethereum.request({
    method: "eth_chainId",
  });
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

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
