import type { Card, MatchState, TargetState } from "./types";
import type { PlayIntent } from "./match";

export type AIDifficulty = "easy" | "medium" | "hard";

export function chooseAIPlays(
  state: MatchState,
  aiPlayer: "P1" | "P2",
  difficulty: AIDifficulty
): PlayIntent[] {
  const player = aiPlayer === "P1" ? state.p1 : state.p2;
  if (player.hand.length === 0 || player.energy === 0) return [];

  // Generate (card × target) candidate plays
  const candidates: Array<{ card: Card; target: TargetState; score: number }> = [];
  for (const card of player.hand) {
    if (card.energy > player.energy) continue;
    for (const target of state.targets) {
      if (target.locked) continue;
      const score = scorePlay(state, aiPlayer, card, target, difficulty);
      candidates.push({ card, target, score });
    }
  }

  if (!candidates.length) return [];
  candidates.sort((a, b) => b.score - a.score);

  const plays: PlayIntent[] = [];
  let energyLeft = player.energy;
  const usedCardIds = new Set<string>();
  const poolSize = difficulty === "easy" ? 5 : difficulty === "medium" ? 3 : 1;

  while (energyLeft > 0) {
    const pool = candidates.filter(c =>
      !usedCardIds.has(c.card.id) && c.card.energy <= energyLeft
    ).slice(0, poolSize);
    if (!pool.length) break;
    const choice = pool[Math.floor(Math.random() * pool.length)];
    plays.push({ player: aiPlayer, cardId: choice.card.id, targetId: choice.target.id });
    usedCardIds.add(choice.card.id);
    energyLeft -= choice.card.energy;
  }

  return plays;
}

function scorePlay(
  _state: MatchState,
  player: "P1" | "P2",
  card: Card,
  target: TargetState,
  difficulty: AIDifficulty
): number {
  let score = 0;

  // Heuristic 1: face value
  for (const e of card.effects) {
    if (e.type === "BREACH" || e.type === "BREACH_CONDITIONAL") score += (e.value ?? 0);
    if (e.type === "SECURE" || e.type === "SECURE_CONDITIONAL") score += (e.value ?? 0);
  }

  // Heuristic 2: defending — prioritize threatened targets
  // For P2, "threatened" means score > 0 (P1 winning); for P1, score < 0
  const playerSign = player === "P1" ? +1 : -1;
  if (card.faction === "DEFENDER") {
    if (target.score * -playerSign > 0) score += Math.abs(target.score) * 2;
  }

  // Heuristic 3: attacking — prioritize unprotected targets
  if (card.faction === "ATTACKER") {
    const hasDefender = target.cardsPlayed.some(p => p.card.faction === "DEFENDER");
    if (!hasDefender) score += 3;

    if (card.id === "BRUTE_FORCE_BOT") {
      const hasMFA = target.cardsPlayed.some(p => p.card.id === "MFA");
      if (!hasMFA) score += 5;
      else score -= 10;
    }
  }

  // Heuristic 4 (hard only): synergies
  if (difficulty === "hard") {
    if (card.id === "STOLEN_CREDENTIALS") {
      const hasPhishing = target.cardsPlayed.some(p =>
        p.card.id === "PHISHING_LURE" && p.player === player
      );
      if (hasPhishing) score += 6;
    }
  }

  // Easy AI adds noise
  if (difficulty === "easy") score += (Math.random() - 0.5) * 8;

  return score;
}
