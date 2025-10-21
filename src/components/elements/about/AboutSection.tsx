import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AboutSectionProps {
  selectedIndex: number;
}

const aboutAnswers = [
  {
    title: "What is BnbPredectionMaket?",
    content: [
      "BnbPredectionMaket is a decentralized prediction market where you can forecast real-world events such as sports, crypto, politics, and more while earning rewards for accurate calls. Blockchain keeps the experience transparent, secure, and community driven.",
      "Unlike traditional betting or centralized prediction sites, BnbPredectionMaket lets the community create, join, and resolve markets. Anyone can propose an event and the crowd shapes the odds and outcomes. The interface stays welcoming whether you are new or experienced.",
    ],
  },
  {
    title: "How do prediction markets work?",
    content: [
      "Prediction markets let people buy and sell shares tied to future outcomes. If your call is correct, you earn a payout. Prices reflect the crowd’s view, and every trade is recorded on-chain for transparency and fairness.",
      "On BnbPredectionMaket each market offers YES and NO positions. As traders buy shares the price shifts to reflect perceived probability. You can adjust or exit before settlement, and smart contracts handle the eventual payouts automatically.",
    ],
  },
  {
    title: "Is BnbPredectionMaket safe and secure?",
    content: [
      "Yes. BnbPredectionMaket relies on blockchain and smart contracts so trades remain transparent, tamper resistant, and automated. Funds stay in decentralized protocols and market outcomes resolve in the open.",
      "We never take custody of your assets; everything is managed by secure smart contracts. Transactions are visible on-chain and backed by community governance and dispute processes that keep markets fair.",
    ],
  },
  {
    title: "How do I participate?",
    content: [
      "To participate, connect your wallet and explore the available markets. Buy shares in outcomes you believe in, create markets of your own, and track your performance from an intuitive dashboard.",
      "Getting started is simple: connect a supported wallet, load it with funds, and browse active markets by category or closing time. If inspiration strikes, submit a new market and invite others to join. Help resources and community support are always nearby.",
    ],
  },
  {
    title: "How do markets go live?",
    content: [
      "Once a market is created and approved it appears in the active list immediately. Traders can begin placing YES or NO positions right away, with odds updating as the crowd participates.",
      "If a market requires additional details the team may hold it in the pending view temporarily, but no separate funding step is required. Everything moves on-chain the moment the market is published.",
    ],
  },
  {
    title: "What can I predict on BnbPredectionMaket?",
    content: [
      "You can predict outcomes across sports, cryptocurrency prices, politics, entertainment, and more. New markets appear regularly and you are free to propose your own ideas.",
      "The platform grows with community creativity. Whether you are tracking elections, a new token, or a championship game, there is space to create or join a market. Fresh concepts are always welcome.",
    ],
  },
  {
    title: "How does BnbPredectionMaket make money?",
    content: [
      "BnbPredectionMaket charges a modest fee on trades and market settlements. The revenue supports platform operations, liquidity incentives, and ongoing development. Fees are clearly displayed and kept low for users.",
      "We value transparency. The fee structure is straightforward with no hidden costs, and part of the revenue returns to the community through product upgrades, rewards, and security enhancements.",
    ],
  },
];

const AboutSection: React.FC<AboutSectionProps> = ({ selectedIndex }) => {
  const section = aboutAnswers[selectedIndex];
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (answerRef.current && window.innerWidth < 768) {
      answerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedIndex]);

  return (
    <div className="flex-1 py-4 md:py-6 flex flex-col justify-start items-start gap-8 md:gap-14 lg:max-h-[80vh] h-auto overflow-y-auto w-full">
      <div className="w-full flex flex-col justify-start items-start gap-2 md:gap-4">
        <div className="text-white text-2xl md:text-5xl font-bold font-['Rubik'] leading-tight md:leading-[48px]">
          {section.title}
        </div>
        <div className="w-full flex flex-col justify-start items-start gap-6 md:gap-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              ref={answerRef}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full max-w-5xl ml-0 bg-[#12161f] rounded-2xl shadow-lg p-6 md:p-10 px-4 mt-2 md:mt-4"
            >
              {section.content.map((paragraph, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 * idx, ease: "easeOut" }}
                  className={`w-full bg-[#202325] rounded-xl p-4 md:p-6 mb-4 shadow text-[#9EA5B5] text-base md:text-xl font-normal font-['Rubik'] leading-7 ${idx === section.content.length - 1 ? 'mb-0' : ''}`}
                >
                  {paragraph}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export { AboutSection };

