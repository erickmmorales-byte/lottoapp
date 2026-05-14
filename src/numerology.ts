import { fnv1a } from "./lottery";

export type NumerologyInputs = {
  name: string;
  dob: string;
  hometown: string;
  timeOfBirth?: string;
};

export type NumerologyProfile = {
  lifePath: number;
  expression: number;
  origin: number;
  birthHour: number;
};

const PYTHAGOREAN: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const MASTERS = new Set([11, 22, 33]);

export function reduce(n: number, keepMasters = false): number {
  let v = Math.abs(Math.floor(n));
  while (v > 9) {
    if (keepMasters && MASTERS.has(v)) return v;
    let sum = 0;
    while (v > 0) {
      sum += v % 10;
      v = Math.floor(v / 10);
    }
    v = sum;
  }
  return v;
}

function lettersOnly(input: string): string {
  return input.toUpperCase().replace(/[^A-Z]/g, "");
}

function digitsOnly(input: string): string {
  return input.replace(/[^0-9]/g, "");
}

function letterSum(input: string): number {
  let sum = 0;
  for (const ch of lettersOnly(input)) sum += PYTHAGOREAN[ch] ?? 0;
  return sum;
}

function digitSum(input: string): number {
  let sum = 0;
  for (const ch of digitsOnly(input)) sum += parseInt(ch, 10);
  return sum;
}

export function computeProfile(inputs: NumerologyInputs): NumerologyProfile {
  return {
    lifePath: reduce(digitSum(inputs.dob), true),
    expression: reduce(letterSum(inputs.name), true),
    origin: reduce(letterSum(inputs.hometown)),
    birthHour: inputs.timeOfBirth ? reduce(digitSum(inputs.timeOfBirth)) : 0,
  };
}

export type SeedContext = {
  now: Date;
  tweak: number;
  random: number;
};

export function buildNumerologySeed(
  profile: NumerologyProfile,
  ctx: SeedContext,
): number {
  const { now, tweak, random } = ctx;
  const dayKey = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;
  const minuteOfDay = now.getHours() * 60 + now.getMinutes();
  const dayEnergy = reduce(digitSum(dayKey));

  // Mixed formula: personal numbers * day energy + minute-of-day, then woven with random + tweak
  const personal =
    profile.lifePath * 1000 +
    profile.expression * 100 +
    profile.origin * 10 +
    profile.birthHour;

  const blend = `${personal}|${dayEnergy}|${minuteOfDay}|${tweak}|${random}`;
  return fnv1a(blend);
}

export function freshSeedContext(tweak = 0): SeedContext {
  return {
    now: new Date(),
    tweak,
    random: Math.floor(Math.random() * 0xffffffff) >>> 0,
  };
}

export function profileSummary(p: NumerologyProfile): { label: string; value: string }[] {
  return [
    { label: "Life Path", value: String(p.lifePath) },
    { label: "Expression", value: String(p.expression) },
    { label: "Origin", value: String(p.origin) },
    { label: "Birth Hour", value: p.birthHour ? String(p.birthHour) : "—" },
  ];
}
