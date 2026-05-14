import { fnv1a } from "./lottery";
import { SeedContext } from "./numerology";

export type Sign = {
  id: string;
  name: string;
  symbol: string;
  dates: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  accent: string;
};

export const SIGNS: Sign[] = [
  { id: "aries", name: "Aries", symbol: "♈", dates: "Mar 21 – Apr 19", element: "Fire", accent: "#ef4444" },
  { id: "taurus", name: "Taurus", symbol: "♉", dates: "Apr 20 – May 20", element: "Earth", accent: "#84cc16" },
  { id: "gemini", name: "Gemini", symbol: "♊", dates: "May 21 – Jun 20", element: "Air", accent: "#facc15" },
  { id: "cancer", name: "Cancer", symbol: "♋", dates: "Jun 21 – Jul 22", element: "Water", accent: "#38bdf8" },
  { id: "leo", name: "Leo", symbol: "♌", dates: "Jul 23 – Aug 22", element: "Fire", accent: "#f97316" },
  { id: "virgo", name: "Virgo", symbol: "♍", dates: "Aug 23 – Sep 22", element: "Earth", accent: "#10b981" },
  { id: "libra", name: "Libra", symbol: "♎", dates: "Sep 23 – Oct 22", element: "Air", accent: "#f472b6" },
  { id: "scorpio", name: "Scorpio", symbol: "♏", dates: "Oct 23 – Nov 21", element: "Water", accent: "#a855f7" },
  { id: "sagittarius", name: "Sagittarius", symbol: "♐", dates: "Nov 22 – Dec 21", element: "Fire", accent: "#dc2626" },
  { id: "capricorn", name: "Capricorn", symbol: "♑", dates: "Dec 22 – Jan 19", element: "Earth", accent: "#475569" },
  { id: "aquarius", name: "Aquarius", symbol: "♒", dates: "Jan 20 – Feb 18", element: "Air", accent: "#22d3ee" },
  { id: "pisces", name: "Pisces", symbol: "♓", dates: "Feb 19 – Mar 20", element: "Water", accent: "#6366f1" },
];

export function findSign(id: string): Sign | undefined {
  return SIGNS.find((s) => s.id === id);
}

export function buildHoroscopeSeed(signId: string, ctx: SeedContext): number {
  const { now, tweak, random } = ctx;
  const dayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const minuteOfDay = now.getHours() * 60 + now.getMinutes();
  return fnv1a(`${signId}|${dayKey}|${minuteOfDay}|${tweak}|${random}`);
}

const VIBES = [
  "Your stars align with momentum today.",
  "A quiet day to trust your intuition.",
  "Bold moves are favored — but stay grounded.",
  "Connection and conversation bring luck.",
  "Patience pays. Let things unfold.",
  "Creative energy is high — channel it.",
  "Watch for signs in everyday moments.",
  "A reset day. Clear the slate.",
];

export function dailyVibe(signId: string, now = new Date()): string {
  const key = `${signId}-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const idx = fnv1a(key) % VIBES.length;
  return VIBES[idx];
}
