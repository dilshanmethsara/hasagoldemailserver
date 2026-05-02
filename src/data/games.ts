import freefire from "@/assets/game-freefire.jpg";
import pubg from "@/assets/game-pubg.jpg";
import codm from "@/assets/game-codm.jpg";
import coc from "@/assets/game-coc.jpg";
import bloodstrike from "@/assets/game-bloodstrike.jpg";
import mlbb from "@/assets/game-mlbb.jpg";
import genshin from "@/assets/game-genshin.jpg";

export type Package = {
  id: string;
  label: string;
  amount: number;
  unit: string;
  price: number;
  bonus?: number;
  popular?: boolean;
  discount?: number;
  type?: "gold" | "pass" | "gems" | "diamond" | "uc" | "cp";
};

export type Game = {
  id: string;
  name: string;
  publisher: string;
  category: "Battle Royale" | "MOBA" | "Strategy" | "RPG" | "Shooter";
  image: string;
  tagline: string;
  currency: string;
  currencySymbol?: string;
  fields: { key: string; label: string; placeholder: string }[];
  packages: Package[];
  rating: number;
  orders: string;
  status?: "available" | "coming-soon";
};



export const GAMES: Game[] = [
  {
    id: "blood-strike",
    name: "Blood Strike",
    publisher: "NetEase",
    category: "Battle Royale",
    image: bloodstrike,
    tagline: "Fast-paced battle royale chaos.",
    currency: "Gold",
    currencySymbol: "LKR",
    fields: [{ key: "playerId", label: "Player ID", placeholder: "Enter your ID" }],
    rating: 4.6,
    orders: "210K",
    status: "available",
    packages: [
      { id: "bs-elite", label: "Strike Pass Elite", amount: 1, unit: "Pass", price: 1100, type: "pass" },
      { id: "bs-premium", label: "Strike Pass Premium", amount: 1, unit: "Pass", price: 2500, popular: true, type: "pass" },
      { id: "bs-levelup", label: "Level-Up Pass", amount: 1, unit: "Pass", price: 600, type: "pass" },
      { id: "bs-100", label: "100 Gold", amount: 100, unit: "Gold", price: 290, bonus: 16, type: "gold" },
      { id: "bs-300", label: "300 Gold", amount: 300, unit: "Gold", price: 850, bonus: 52, type: "gold" },
      { id: "bs-500", label: "500 Gold", amount: 500, unit: "Gold", price: 1350, bonus: 94, type: "gold" },
      { id: "bs-1000", label: "1000 Gold", amount: 1000, unit: "Gold", price: 2700, bonus: 210, type: "gold" },
      { id: "bs-2000", label: "2000 Gold", amount: 2000, unit: "Gold", price: 5300, bonus: 486, type: "gold" },
      { id: "bs-5000", label: "5000 Gold", amount: 5000, unit: "Gold", price: 13800, bonus: 1380, type: "gold" },
    ],
  },


  {
    id: "free-fire",
    name: "Free Fire",
    publisher: "Garena",
    category: "Battle Royale",
    image: freefire,
    tagline: "Survive. Loot. Conquer.",
    currency: "Diamonds",
    fields: [{ key: "playerId", label: "Player ID", placeholder: "e.g. 1234567890" }],
    rating: 4.9,
    orders: "1.2M",
    status: "coming-soon",
    packages: [
      { id: "ff-100", label: "100 Diamonds", amount: 100, unit: "💎", price: 1.49 },
      { id: "ff-310", label: "310 Diamonds", amount: 310, unit: "💎", price: 4.49, bonus: 10 },
      { id: "ff-520", label: "520 Diamonds", amount: 520, unit: "💎", price: 6.99, popular: true, bonus: 20 },
      { id: "ff-1060", label: "1060 Diamonds", amount: 1060, unit: "💎", price: 13.99, bonus: 60, discount: 5 },
      { id: "ff-2180", label: "2180 Diamonds", amount: 2180, unit: "💎", price: 27.99, bonus: 180, discount: 10 },
      { id: "ff-5600", label: "5600 Diamonds", amount: 5600, unit: "💎", price: 67.99, bonus: 600, discount: 15 },
    ],
  },
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    publisher: "Tencent",
    category: "Battle Royale",
    image: pubg,
    tagline: "Winner Winner Chicken Dinner.",
    currency: "UC",
    fields: [{ key: "playerId", label: "Player ID", placeholder: "Enter your PUBG ID" }],
    rating: 4.8,
    orders: "980K",
    status: "coming-soon",
    packages: [
      { id: "pubg-60", label: "60 UC", amount: 60, unit: "UC", price: 0.99 },
      { id: "pubg-325", label: "325 UC", amount: 325, unit: "UC", price: 4.99, bonus: 25 },
      { id: "pubg-660", label: "660 UC", amount: 660, unit: "UC", price: 9.99, popular: true, bonus: 60 },
      { id: "pubg-1800", label: "1800 UC", amount: 1800, unit: "UC", price: 24.99, bonus: 300, discount: 8 },
      { id: "pubg-3850", label: "3850 UC", amount: 3850, unit: "UC", price: 49.99, bonus: 850, discount: 12 },
      { id: "pubg-8100", label: "8100 UC", amount: 8100, unit: "UC", price: 99.99, bonus: 2100, discount: 18 },
    ],
  },
  {
    id: "codm",
    name: "Call of Duty Mobile",
    publisher: "Activision",
    category: "Shooter",
    image: codm,
    tagline: "Tactical warfare in your pocket.",
    currency: "CP",
    fields: [{ key: "playerId", label: "Player ID", placeholder: "Player ID#TAG" }],
    rating: 4.7,
    orders: "640K",
    status: "coming-soon",
    packages: [
      { id: "cod-80", label: "80 CP", amount: 80, unit: "CP", price: 0.99 },
      { id: "cod-400", label: "400 CP", amount: 400, unit: "CP", price: 4.99, bonus: 20 },
      { id: "cod-800", label: "800 CP", amount: 800, unit: "CP", price: 9.99, popular: true, bonus: 80 },
      { id: "cod-2000", label: "2000 CP", amount: 2000, unit: "CP", price: 24.99, bonus: 400, discount: 8 },
      { id: "cod-5000", label: "5000 CP", amount: 5000, unit: "CP", price: 49.99, bonus: 1000, discount: 14 },
    ],
  },
  {
    id: "clash-of-clans",
    name: "Clash of Clans",
    publisher: "Supercell",
    category: "Strategy",
    image: coc,
    tagline: "Build. Battle. Triumph.",
    currency: "Gems",
    fields: [
      { key: "playerId", label: "Player Tag", placeholder: "#ABC123" },
    ],
    rating: 4.8,
    orders: "420K",
    status: "coming-soon",
    packages: [
      { id: "coc-80", label: "80 Gems", amount: 80, unit: "Gems", price: 0.99 },
      { id: "coc-500", label: "500 Gems", amount: 500, unit: "Gems", price: 4.99, popular: true, bonus: 25 },
      { id: "coc-1200", label: "1200 Gems", amount: 1200, unit: "Gems", price: 9.99, bonus: 100, discount: 5 },
      { id: "coc-2500", label: "2500 Gems", amount: 2500, unit: "Gems", price: 19.99, bonus: 250, discount: 10 },
      { id: "coc-6500", label: "6500 Gems", amount: 6500, unit: "Gems", price: 49.99, bonus: 800, discount: 15 },
    ],
  },
  {
    id: "mlbb",
    name: "Mobile Legends",
    publisher: "Moonton",
    category: "MOBA",
    image: mlbb,
    tagline: "Epic 5v5 MOBA action.",
    currency: "Diamonds",
    fields: [
      { key: "playerId", label: "User ID", placeholder: "12345678" },
      { key: "serverId", label: "Server ID", placeholder: "1234" },
    ],
    rating: 4.7,
    orders: "850K",
    status: "coming-soon",
    packages: [
      { id: "ml-86", label: "86 Diamonds", amount: 86, unit: "💎", price: 1.49 },
      { id: "ml-172", label: "172 Diamonds", amount: 172, unit: "💎", price: 2.99, bonus: 8 },
      { id: "ml-344", label: "344 Diamonds", amount: 344, unit: "💎", price: 5.49, popular: true, bonus: 16 },
      { id: "ml-706", label: "706 Diamonds", amount: 706, unit: "💎", price: 10.99, bonus: 35, discount: 5 },
      { id: "ml-2195", label: "2195 Diamonds", amount: 2195, unit: "💎", price: 32.99, bonus: 110, discount: 10 },
    ],
  },
  {
    id: "genshin",
    name: "Genshin Impact",
    publisher: "HoYoverse",
    category: "RPG",
    image: genshin,
    tagline: "Open-world adventure awaits.",
    currency: "Genesis Crystals",
    fields: [
      { key: "playerId", label: "UID", placeholder: "9-digit UID" },
      { key: "serverId", label: "Server", placeholder: "Asia / America / Europe" },
    ],
    rating: 4.9,
    orders: "1.5M",
    status: "coming-soon",
    packages: [
      { id: "gi-60", label: "60 Crystals", amount: 60, unit: "✨", price: 0.99 },
      { id: "gi-330", label: "330 Crystals", amount: 330, unit: "✨", price: 4.99, bonus: 30 },
      { id: "gi-1090", label: "1090 Crystals", amount: 1090, unit: "✨", price: 14.99, popular: true, bonus: 90 },
      { id: "gi-2240", label: "2240 Crystals", amount: 2240, unit: "✨", price: 29.99, bonus: 240, discount: 8 },
      { id: "gi-3880", label: "3880 Crystals", amount: 3880, unit: "✨", price: 49.99, bonus: 480, discount: 12 },
      { id: "gi-8080", label: "8080 Crystals", amount: 8080, unit: "✨", price: 99.99, bonus: 1080, discount: 18 },
    ],
  },
];


export const getGame = (id: string) => GAMES.find((g) => g.id === id);
