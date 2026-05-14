export type NumberMeaning = { keyword: string; description: string };

export const NUMBER_MEANINGS: Record<number, NumberMeaning> = {
  1: {
    keyword: "The Leader",
    description:
      "Independent, original, and pioneering. Ones are driven to forge their own path, start new things, and lead. The shadow side: stubbornness and a reluctance to ask for help.",
  },
  2: {
    keyword: "The Peacemaker",
    description:
      "Cooperative, intuitive, and sensitive. Twos thrive in partnership and bring harmony to any room. The shadow side: indecision and over-giving.",
  },
  3: {
    keyword: "The Creative",
    description:
      "Expressive, playful, and social. Threes light up the world through art, words, and conversation. The shadow side: scattered energy and superficiality.",
  },
  4: {
    keyword: "The Builder",
    description:
      "Practical, disciplined, and hard-working. Fours build foundations that last. The shadow side: rigidity and resistance to change.",
  },
  5: {
    keyword: "The Adventurer",
    description:
      "Curious, freedom-loving, and adaptable. Fives chase experience and crave variety. The shadow side: restlessness and trouble committing.",
  },
  6: {
    keyword: "The Nurturer",
    description:
      "Caring, responsible, and family-oriented. Sixes are the heart of their communities. The shadow side: over-responsibility and people-pleasing.",
  },
  7: {
    keyword: "The Seeker",
    description:
      "Analytical, spiritual, and introspective. Sevens are deep thinkers drawn to truth and mystery. The shadow side: isolation and overthinking.",
  },
  8: {
    keyword: "The Powerhouse",
    description:
      "Ambitious, authoritative, and resourceful. Eights are wired for material success and leadership. The shadow side: control issues and workaholism.",
  },
  9: {
    keyword: "The Humanitarian",
    description:
      "Compassionate, idealistic, and wise. Nines are old souls who care deeply about the world. The shadow side: martyrdom and difficulty letting go.",
  },
  11: {
    keyword: "Master Number — The Visionary",
    description:
      "The most intuitive number. Elevens carry the energy of a 2 amplified with spiritual insight. The challenge: nervous energy and self-doubt to overcome.",
  },
  22: {
    keyword: "Master Number — The Master Builder",
    description:
      "The most powerful number. Twenty-twos turn lofty visions into tangible reality on a large scale. The challenge: living up to enormous potential.",
  },
  33: {
    keyword: "Master Number — The Master Teacher",
    description:
      "The most spiritually charged number. Thirty-threes are devoted to selfless service and inspiration. The challenge: deep responsibility and emotional intensity.",
  },
};

export type SectionInfo = {
  key: "lifePath" | "expression" | "origin" | "birthHour";
  title: string;
  blurb: string;
};

export const SECTIONS: SectionInfo[] = [
  {
    key: "lifePath",
    title: "Life Path Number",
    blurb:
      "Derived from your date of birth — the cornerstone of numerology. Your Life Path describes the overall journey of your life: the lessons you came here to learn and the direction your spirit is naturally pulled toward.",
  },
  {
    key: "expression",
    title: "Expression Number",
    blurb:
      "Calculated from the letters of your full name using the Pythagorean system (A=1, B=2 … I=9, then repeating). It reveals your innate talents and what you are here to express in the world.",
  },
  {
    key: "origin",
    title: "Origin Number",
    blurb:
      "Lucky Numbers' twist: the energy of the place that shaped you. Your hometown's letters are reduced the same way as the Expression number, hinting at the influence of where you began.",
  },
  {
    key: "birthHour",
    title: "Birth Hour Number",
    blurb:
      "When provided, the digits of your time of birth are reduced into a single number. It reflects the energy of the hour you arrived — a small detail that can color the rest of your reading.",
  },
];
