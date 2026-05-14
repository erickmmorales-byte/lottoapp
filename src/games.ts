export type Game = {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  picks: { count: number; min: number; max: number; label: string }[];
  bonus?: { count: number; min: number; max: number; label: string };
};

export const GAMES: Game[] = [
  {
    id: "powerball",
    name: "Powerball",
    tagline: "Multi-state · Mon / Wed / Sat",
    accent: "#e11d48",
    picks: [{ count: 5, min: 1, max: 69, label: "White Balls" }],
    bonus: { count: 1, min: 1, max: 26, label: "Powerball" },
  },
  {
    id: "megamillions",
    name: "Mega Millions",
    tagline: "Multi-state · Tue / Fri",
    accent: "#f59e0b",
    picks: [{ count: 5, min: 1, max: 70, label: "White Balls" }],
    bonus: { count: 1, min: 1, max: 25, label: "Mega Ball" },
  },
  {
    id: "superlotto",
    name: "SuperLotto Plus",
    tagline: "California · Wed / Sat",
    accent: "#3b82f6",
    picks: [{ count: 5, min: 1, max: 47, label: "Main Numbers" }],
    bonus: { count: 1, min: 1, max: 27, label: "Mega" },
  },
  {
    id: "fantasy5",
    name: "Fantasy 5",
    tagline: "California · Daily",
    accent: "#10b981",
    picks: [{ count: 5, min: 1, max: 39, label: "Numbers" }],
  },
  {
    id: "daily3",
    name: "Daily 3",
    tagline: "California · Twice Daily",
    accent: "#8b5cf6",
    picks: [{ count: 3, min: 0, max: 9, label: "Digits (with repeats)" }],
  },
  {
    id: "daily4",
    name: "Daily 4",
    tagline: "California · Daily",
    accent: "#ec4899",
    picks: [{ count: 4, min: 0, max: 9, label: "Digits (with repeats)" }],
  },
];
