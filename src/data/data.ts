import { IconName } from "@/components/elements/Icons/Icons";
import type { Metadata } from "next";

export const categories = [
  { name: "Trending", active: true, icon: "Trending" as IconName, color: "#FCD535" },
  { name: "Sports", active: false, icon: "Sports" as IconName, color: "#9EA5B5" },
  { name: "Crypto", active: false, icon: "Crypto" as IconName, color: "#9EA5B5" },
  { name: "News", active: false, icon: "News" as IconName, color: "#9EA5B5" },
];

export const url = "http://localhost:8080/"

export const metadata: Metadata = {
  title: "BnbPredectionMaket",
  description: "BnbPredectionMaket — decentralized prediction markets powered by BNB.",
};

export const ranges = [
  "Small",
  "Exact",
  "Near",
  "Bigger"
]

export const marketField = [
  {
    name: "Coin Prediction Market",
    content: [
      {
        api_name: "Coingecho",
        needed_data: [
          // {
          //   name: "vs_currency",
          //   placeholder: "usd"
          // },
          {
            name: "feedName",
            placeholder: "bnb"
          }
        ],
        task: (index: number, rang: number) => "null",
        api_link: (...args: any[]) => args[1]?`https://api.coingecko.com/api/v3/coins/markets?ids=${args[0]}&vs_currency=usd`:`https://api.coingecko.com/api/v3/simple/price?ids=${args[0]}&vs_currencies=usd`,
        // mc_link: (...args: string[]) => `https://api.coingecko.com/api/v3/coins/markets?ids=${args[0]}&vs_currency=usd`,
        market_keyword: (...args: string[]) => `id: ${args[0]}, vs_currency: usd`,
      },
      {
        api_name: "Dexscreener",
        needed_data: [
          {
            name: "feedName",
            placeholder: "EGfWrQjqEexyPcZNUFGU8LypCikg34q2vqtk7hwBzWdS"
          }
        ],
        task: (index: number, rang: number) =>  rang?`$.pairs[${index}].marketCap` : `$.pairs[${index}].priceUsd`,
        api_link: (...args: any[]) => `https://api.dexscreener.com/latest/dex/tokens/${args[0]}`,
        // mc_link: (...args: string[]) => `https://api.dexscreener.com/latest/dex/tokens/${args[0]}`,
        market_keyword: (...args: string[]) => `token: ${args[0]}`,
      }
    ]
  },
  {
    name: "Sports Prediction Market",
    content: [
      {
        api_name: "NBA",
        needed_data: [
          {
            name: "sport",
            placeholder: "basketball"
          },
          {
            name: "league",
            placeholder: "NBA"
          },
          {
            name: "team",
            placeholder: "Lakers"
          },
          {
            name: "stat_type",
            placeholder: "points"
          }
        ],
        task: (index: number, rang: number) => "null",
        api_link: (...args: any[]) => `https://api.sportsdata.io/v3/nba/stats/json/PlayerGameStatsByDate/${args[0]}/${args[1]}`,
        market_keyword: (...args: string[]) => `sport: ${args[0]}, league: ${args[1]}, team: ${args[2]}, stat: ${args[3]}`,
      },
      {
        api_name: "NFL",
        needed_data: [
          {
            name: "sport",
            placeholder: "football"
          },
          {
            name: "league",
            placeholder: "NFL"
          },
          {
            name: "team",
            placeholder: "Chiefs"
          },
          {
            name: "stat_type",
            placeholder: "passing_yards"
          }
        ],
        task: (index: number, rang: number) => "null",
        api_link: (...args: any[]) => `https://api.sportsdata.io/v3/nfl/stats/json/PlayerGameStatsByDate/${args[0]}/${args[1]}`,
        market_keyword: (...args: string[]) => `sport: ${args[0]}, league: ${args[1]}, team: ${args[2]}, stat: ${args[3]}`,
      },
      {
        api_name: "MLB",
        needed_data: [
          {
            name: "sport",
            placeholder: "baseball"
          },
          {
            name: "league",
            placeholder: "MLB"
          },
          {
            name: "team",
            placeholder: "Yankees"
          },
          {
            name: "stat_type",
            placeholder: "hits"
          }
        ],
        task: (index: number, rang: number) => "null",
        api_link: (...args: any[]) => `https://api.sportsdata.io/v3/mlb/stats/json/PlayerGameStatsByDate/${args[0]}/${args[1]}`,
        market_keyword: (...args: string[]) => `sport: ${args[0]}, league: ${args[1]}, team: ${args[2]}, stat: ${args[3]}`,
      },
      {
        api_name: "Soccer",
        needed_data: [
          {
            name: "sport",
            placeholder: "soccer"
          },
          {
            name: "league",
            placeholder: "Premier League"
          },
          {
            name: "team",
            placeholder: "Manchester United"
          },
          {
            name: "stat_type",
            placeholder: "goals"
          }
        ],
        task: (index: number, rang: number) => "null",
        api_link: (...args: any[]) => `https://api.sportsdata.io/v3/soccer/stats/json/PlayerGameStatsByDate/${args[0]}/${args[1]}`,
        market_keyword: (...args: string[]) => `sport: ${args[0]}, league: ${args[1]}, team: ${args[2]}, stat: ${args[3]}`,
      }
    ]
  }
]

