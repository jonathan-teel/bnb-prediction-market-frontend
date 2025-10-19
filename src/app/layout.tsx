"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "../components/layouts";
import { GlobalProvider } from "@/providers/GlobalContext";
import "react-multi-carousel/lib/styles.css";
import { WalletProvider } from "@/providers/WalletProvider";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <ToastContainer />
          <GlobalProvider>
            <Layout>{children}</Layout>
          </GlobalProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
