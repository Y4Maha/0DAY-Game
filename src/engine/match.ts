import type { Card, Faction, MatchState, TargetState, PlayerState } from "./types";
import { applyEffects } from "./effects";

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
    energy: 2,
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

export interface PlayIntent {
  player: "P1" | "P2";
  cardId: string;
  targetId: string;
}

export function playCards(
  state: MatchState,
  p1Plays: PlayIntent[],
  p2Plays: PlayIntent[]
): MatchState {
  const next = structuredClone(state) as MatchState;

  // Validate
  for (const intent of [...p1Plays, ...p2Plays]) {
    const player = intent.player === "P1" ? next.p1 : next.p2;
    const card = player.hand.find(c => c.id === intent.cardId);
    if (!card) throw new Error(`Card ${intent.cardId} not in ${intent.player} hand`);
    const target = next.targets.find(t => t.id === intent.targetId);
    if (!target) throw new Error(`Target ${intent.targetId} not found`);
    if (target.locked) throw new Error(`Target ${intent.targetId} is locked`);
  }

  const sumEnergy = (intents: PlayIntent[], hand: Card[]) =>
    intents.reduce((s, i) => s + (hand.find(c => c.id === i.cardId)?.energy ?? 0), 0);

  if (sumEnergy(p1Plays, next.p1.hand) > next.p1.energy)
    throw new Error("P1 insufficient energy");
  if (sumEnergy(p2Plays, next.p2.hand) > next.p2.energy)
    throw new Error("P2 insufficient energy");

  // Move cards from hand to target.cardsPlayed
  for (const intent of [...p1Plays, ...p2Plays]) {
    const player = intent.player === "P1" ? next.p1 : next.p2;
    const card = player.hand.find(c => c.id === intent.cardId)!;
    player.hand = player.hand.filter(c => c.id !== intent.cardId);
    player.energy -= card.energy;
    const target = next.targets.find(t => t.id === intent.targetId)!;
    target.cardsPlayed.push({ card, player: intent.player, turn: next.turn });
    next.log.push({ kind: "PLAY", player: intent.player, card, targetId: target.id, turn: next.turn });
  }

  // Resolve effects in deterministic order: lowest energy first
  const allIntents = [...p1Plays, ...p2Plays];
  const resolutions = allIntents
    .map(i => {
      const card = next.targets
        .find(t => t.id === i.targetId)!
        .cardsPlayed.find(p => p.card.id === i.cardId && p.player === i.player)!.card;
      return { intent: i, card };
    })
    .sort((a, b) => a.card.energy - b.card.energy);

  for (const { intent, card } of resolutions) {
    applyEffects(next, intent.player, card, intent.targetId);
  }

  return next;
}

export function advanceTurn(state: MatchState): MatchState {
  const next = structuredClone(state) as MatchState;
  next.log.push({ kind: "TURN_END", turn: next.turn });

  if (next.turn >= 6) {
    return endMatch(next);
  }

  next.turn += 1;
  next.p1.energy = next.turn + 1;
  next.p2.energy = next.turn + 1;
  if (next.p1.deck.length) next.p1.hand.push(next.p1.deck.shift()!);
  if (next.p2.deck.length) next.p2.hand.push(next.p2.deck.shift()!);
  return next;
}

function endMatch(state: MatchState): MatchState {
  let p1Captured = 0, p2Captured = 0;
  for (const t of state.targets) {
    if (t.score > 0) p1Captured++;
    else if (t.score < 0) p2Captured++;
  }
  const winner = p1Captured > p2Captured ? "P1" : p2Captured > p1Captured ? "P2" : "DRAW";
  state.phase = "END";
  state.winner = winner;
  state.log.push({ kind: "MATCH_END", winner, targetsCaptured: { P1: p1Captured, P2: p2Captured } });
  return state;
}
