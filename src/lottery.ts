import { Game } from "./games";

export type UserInputs = {
  name: string;
  dob: string;
  hometown: string;
  timeOfBirth?: string;
};

export type Draw = {
  gameId: string;
  main: number[];
  bonus?: number[];
};

function fnv1a(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildSeed(inputs: UserInputs, gameId: string): number {
  const normalized = [
    inputs.name.trim().toLowerCase(),
    inputs.dob.trim(),
    inputs.hometown.trim().toLowerCase(),
    (inputs.timeOfBirth ?? "").trim(),
    gameId,
  ].join("|");
  return fnv1a(normalized);
}

function pickUnique(rng: () => number, count: number, min: number, max: number): number[] {
  const range = max - min + 1;
  if (count > range) {
    throw new Error("Cannot pick more unique numbers than the range allows.");
  }
  const picked = new Set<number>();
  while (picked.size < count) {
    picked.add(min + Math.floor(rng() * range));
  }
  return Array.from(picked).sort((a, b) => a - b);
}

function pickWithReplacement(rng: () => number, count: number, min: number, max: number): number[] {
  const range = max - min + 1;
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    out.push(min + Math.floor(rng() * range));
  }
  return out;
}

export function generateDraw(game: Game, inputs: UserInputs): Draw {
  const rng = mulberry32(buildSeed(inputs, game.id));
  const allowReplacement = game.id === "daily3" || game.id === "daily4";

  const main = game.picks.flatMap((p) =>
    allowReplacement
      ? pickWithReplacement(rng, p.count, p.min, p.max)
      : pickUnique(rng, p.count, p.min, p.max),
  );

  const bonus = game.bonus
    ? pickUnique(rng, game.bonus.count, game.bonus.min, game.bonus.max)
    : undefined;

  return { gameId: game.id, main, bonus };
}
