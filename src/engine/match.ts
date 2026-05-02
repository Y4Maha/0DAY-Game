import { Card, Faction, MatchState, TargetState, PlayerState } from "./types";

const TARGET_POOL = [
  { id: "BANK", name: "Bank Server" },
  { id: "GOV", name: "Government Database" },
  { id: "EXCHANGE", name: "Crypto Exchange" },
  { id: "HOSPITAL", name: "Hospital Network" },
  { id: "GRID", name: "Power Grid" },
];

// Mulberry32 — small, fast, deterministic
export function seededRandom(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6D2B79F5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface InitMatchArgs {
  p1Faction: Faction;
  p1Deck: Card[];
  p2Faction: Faction;
  p2Deck: Card[];
  seed?: number;
}

export function initMatch(args: InitMatchArgs): MatchState {
  const seed = args.seed ?? Date.now();
  const rand = seededRandom(seed);

  const p1Shuffled = shuffle(args.p1Deck, rand);
  const p2Shuffled = shuffle(args.p2Deck, rand);
  const targets = shuffle(TARGET_POOL, rand).slice(0, 3).map<TargetState>(t => ({
    id: t.id, name: t.name, score: 0, locked: false, cardsPlayed: [],
  }));

  const makePlayer = (faction: Faction, deck: Card[]): PlayerState => ({
    faction,
    deck: deck.slice(3),
    hand: deck.slice(0, 3),
    energy: 1,
  });

  return {
    turn: 1,
    targets,
    p1: makePlayer(args.p1Faction, p1Shuffled),
    p2: makePlayer(args.p2Faction, p2Shuffled),
    log: [],
    phase: "PLAY",
    winner: null,
  };
}
