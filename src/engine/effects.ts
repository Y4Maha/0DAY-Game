import { Card, CardEffect, MatchState, TargetState } from "./types";

export function applyEffects(
  state: MatchState,
  player: "P1" | "P2",
  card: Card,
  targetId: string
): void {
  const target = state.targets.find(t => t.id === targetId);
  if (!target) return;
  for (const e of card.effects) {
    resolveEffect(state, player, card, target, e);
  }
}

function resolveEffect(
  state: MatchState,
  player: "P1" | "P2",
  card: Card,
  target: TargetState,
  effect: CardEffect
): void {
  // CORRECTED sign convention: BREACH and SECURE both push score in the
  // direction of the player who plays the card. Faction does not enter sign.
  const playerSign = player === "P1" ? +1 : -1;

  switch (effect.type) {
    case "BREACH": {
      target.score += playerSign * (effect.value ?? 0);
      logEffect(state, player, card, effect, target.id, playerSign * (effect.value ?? 0));
      break;
    }
    case "SECURE": {
      target.score += playerSign * (effect.value ?? 0);
      logEffect(state, player, card, effect, target.id, playerSign * (effect.value ?? 0));
      break;
    }
    default:
      // Other effect types implemented in Task 11
      break;
  }
}

function logEffect(
  state: MatchState,
  player: "P1" | "P2",
  card: Card,
  effect: CardEffect,
  targetId: string,
  resolvedValue: number
) {
  state.log.push({
    kind: "EFFECT",
    player, cardId: card.id, effect, targetId, resolvedValue, turn: state.turn,
  });
}
