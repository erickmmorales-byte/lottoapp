import { Draw } from "./lottery";
import { NumerologyProfile } from "./numerology";

let AsyncStorage: any = null;
try {
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
} catch {
  // Fall back to in-memory store if the native module isn't linked.
}

const HISTORY_KEY = "lottoapp:history:v1";
const SETTINGS_KEY = "lottoapp:settings:v1";

const memory = new Map<string, string>();

async function getItem(key: string): Promise<string | null> {
  if (AsyncStorage) return AsyncStorage.getItem(key);
  return memory.get(key) ?? null;
}

async function setItem(key: string, value: string): Promise<void> {
  if (AsyncStorage) {
    await AsyncStorage.setItem(key, value);
    return;
  }
  memory.set(key, value);
}

export type HistoryEntry = {
  id: string;
  createdAt: number;
  mode: "numerology" | "horoscope";
  label: string;
  subtitle?: string;
  profile?: NumerologyProfile;
  signId?: string;
  draws: Draw[];
};

export async function loadHistory(): Promise<HistoryEntry[]> {
  const raw = await getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveEntry(entry: HistoryEntry): Promise<HistoryEntry[]> {
  const existing = await loadHistory();
  const next = [entry, ...existing].slice(0, 50);
  await setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export async function clearHistory(): Promise<void> {
  await setItem(HISTORY_KEY, JSON.stringify([]));
}

export type Settings = {
  personalizedAds: boolean;
};

const DEFAULT_SETTINGS: Settings = { personalizedAds: false };

export async function loadSettings(): Promise<Settings> {
  const raw = await getItem(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await setItem(SETTINGS_KEY, JSON.stringify(settings));
}
