export type Faction = "ATTACKER" | "DEFENDER";

export type CardEffectType =
  | "BREACH"
  | "SECURE"
  | "BREACH_CONDITIONAL"
  | "SECURE_CONDITIONAL"
  | "REVEAL_OPPONENT"
  | "REVEAL_HAND"
  | "DRAW"
  | "DISABLE_DEFENDER"
  | "NEGATE_CARD"
  | "LOCK_TARGET"
  | "RESET_TARGET"
  | "BYPASS_MFA"
  | "IGNORE_LOW_DEF"
  | "REDUCE_ENERGY"
  | "HALVE_LOW_ENERGY_BREACH";

export interface CardEffect {
  type: CardEffectType;
  value?: number;
  condition?: string;
  target?: "SELF" | "OPPONENT";
  cardCategory?: string;
}

export interface Card {
  id: string;
  name: string;
  faction: Faction;
  energy: number;
  effects: CardEffect[];
  flavor: string;
  simple?: string;
  category?: string;
  art: string;
}

export interface PlayedCard {
  card: Card;
  player: "P1" | "P2";
  turn: number;
}

export interface TargetState {
  id: string;
  name: string;
  score: number;
  locked: boolean;
  cardsPlayed: PlayedCard[];
}

export interface PlayerState {
  faction: Faction;
  deck: Card[];
  hand: Card[];
  energy: number;
}

export interface MatchState {
  turn: number;
  targets: TargetState[];
  p1: PlayerState;
  p2: PlayerState;
  log: MatchEvent[];
  phase: "DRAW" | "PLAY" | "RESOLVE" | "END";
  winner: "P1" | "P2" | "DRAW" | null;
}

export type MatchEvent =
  | { kind: "PLAY"; player: "P1" | "P2"; card: Card; targetId: string; turn: number }
  | { kind: "EFFECT"; player: "P1" | "P2"; cardId: string; effect: CardEffect; targetId: string; resolvedValue: number; turn: number }
  | { kind: "TURN_END"; turn: number }
  | { kind: "MATCH_END"; winner: "P1" | "P2" | "DRAW"; targetsCaptured: { P1: number; P2: number } };

export interface PendingPlay {
  cardId: string;
  targetId: string;
}
