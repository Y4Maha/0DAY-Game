import { Card, CardEffect, MatchState, TargetState } from "./types";

export function applyEffects(
  state: MatchState,
  player: "P1" | "P2",
  card: Card,
  targetId: string
): void {
  const target = state.targets.find(t => t.id === targetId);
  if (!target) return;

  // If a defender on this target negates this card, skip ALL effects of this card
  if (isNegated(card, target)) {
    state.log.push({
      kind: "EFFECT",
      player, cardId: card.id,
      effect: { type: "NEGATE_CARD" },
      targetId: target.id,
      resolvedValue: 0,
      turn: state.turn,
    });
    return;
  }

  for (const e of card.effects) {
    resolveEffect(state, player, card, target, e);
  }
}

function isNegated(card: Card, target: TargetState): boolean {
  for (const played of target.cardsPlayed) {
    // Don't check card against itself
    if (played.card.id === card.id) continue;
    for (const e of played.card.effects) {
      if (e.type !== "NEGATE_CARD") continue;
      // Negate by specific card id via cardCategory matching card.id (Backup Vault → RANSOMWARE)
      if (e.cardCategory && e.cardCategory === card.id) return true;
      // Negate by card category (Antivirus negates PAYLOAD category cards)
      if (e.cardCategory && card.category && card.category === e.cardCategory) return true;
      // Negate by energy threshold (Firewall: value=1 negates attacker cards with energy <= 1)
      if (e.value !== undefined && card.energy <= e.value && played.card.faction !== card.faction) return true;
    }
  }
  return false;
}

function resolveEffect(
  state: MatchState,
  player: "P1" | "P2",
  card: Card,
  target: TargetState,
  effect: CardEffect
): void {
  // CORRECTED sign convention: BREACH/SECURE push score in player's direction.
  // playerSign: P1 attacks → +1 raises score; P2 defends → -1 lowers score.
  const playerSign = player === "P1" ? +1 : -1;

  switch (effect.type) {
    case "BREACH": {
      const v = applyDamageModifiers(card, target, effect.value ?? 0);
      const delta = playerSign * v;
      target.score += delta;
      logEffect(state, player, card, effect, target.id, delta);
      break;
    }
    case "SECURE": {
      const delta = playerSign * (effect.value ?? 0);
      target.score += delta;
      logEffect(state, player, card, effect, target.id, delta);
      break;
    }
    case "BREACH_CONDITIONAL": {
      // PER_PHISHING_OR_OSINT: bonus per prior Phishing/OSINT played by this player
      if (effect.condition === "PER_PHISHING_OR_OSINT") {
        const priorCount = state.targets
          .flatMap(t => t.cardsPlayed)
          .filter(p =>
            p.player === player &&
            (p.card.id === "PHISHING_LURE" || p.card.id === "OSINT_SCOUT") &&
            // exclude the current card being resolved (if it were Phishing/OSINT, but it's Stolen Credentials here)
            p.card.id !== card.id
          )
          .length;
        const delta = playerSign * (effect.value ?? 0) * priorCount;
        target.score += delta;
        logEffect(state, player, card, effect, target.id, delta);
        break;
      }
      if (!conditionMet(effect.condition, player, target)) break;
      const v = applyDamageModifiers(card, target, effect.value ?? 0);
      const delta = playerSign * v;
      target.score += delta;
      logEffect(state, player, card, effect, target.id, delta);
      break;
    }
    case "SECURE_CONDITIONAL": {
      if (!conditionMet(effect.condition, player, target)) break;
      const delta = playerSign * (effect.value ?? 0);
      target.score += delta;
      logEffect(state, player, card, effect, target.id, delta);
      break;
    }
    case "LOCK_TARGET":
      target.locked = true;
      logEffect(state, player, card, effect, target.id, 0);
      break;
    case "RESET_TARGET":
      if (effect.condition === "BREACHED_THIS_TURN") {
        const breachedThisTurn = target.cardsPlayed.some(p =>
          p.turn === state.turn && p.player !== player && p.card.faction === "ATTACKER"
        );
        if (breachedThisTurn) {
          target.score = 0;
          logEffect(state, player, card, effect, target.id, 0);
        }
      }
      break;
    case "DRAW":
      if (effect.condition === "TARGET_HAS_NO_DEFENDER") {
        const hasDefender = target.cardsPlayed.some(p =>
          p.player !== player && p.card.faction === "DEFENDER"
        );
        if (!hasDefender) {
          const p = player === "P1" ? state.p1 : state.p2;
          if (p.deck.length) p.hand.push(p.deck.shift()!);
          logEffect(state, player, card, effect, target.id, 1);
        }
      }
      break;
    // v1: logged only, no immediate state mutation
    case "REVEAL_OPPONENT":
    case "REVEAL_HAND":
    case "BYPASS_MFA":
    case "IGNORE_LOW_DEF":
    case "REDUCE_ENERGY":
    case "DISABLE_DEFENDER":
    case "HALVE_LOW_ENERGY_BREACH":
    case "NEGATE_CARD":
      logEffect(state, player, card, effect, target.id, 0);
      break;
  }
}

function applyDamageModifiers(card: Card, target: TargetState, baseValue: number): number {
  let value = baseValue;
  // Rate Limiter: HALVE_LOW_ENERGY_BREACH on this target halves breach from cards with energy <= 2
  if (card.faction === "ATTACKER" && card.energy <= 2) {
    const halved = target.cardsPlayed.some(p =>
      p.card.faction === "DEFENDER" &&
      p.card.effects.some(e => e.type === "HALVE_LOW_ENERGY_BREACH")
    );
    if (halved) value = Math.floor(value / 2);
  }
  return value;
}

function conditionMet(
  condition: string | undefined,
  player: "P1" | "P2",
  target: TargetState
): boolean {
  if (!condition) return true;
  switch (condition) {
    case "NO_MFA_ON_TARGET":
      return !target.cardsPlayed.some(p => p.card.id === "MFA");
    case "MFA_ON_TARGET": {
      const hasMFA = target.cardsPlayed.some(p => p.card.id === "MFA");
      const bypassed = target.cardsPlayed.some(p =>
        p.player === player && p.card.effects.some(e => e.type === "BYPASS_MFA")
      );
      return hasMFA && !bypassed;
    }
    case "TARGET_HAS_NO_DEFENDER":
      return !target.cardsPlayed.some(p =>
        p.player !== player && p.card.faction === "DEFENDER"
      );
    case "BREACHED_THIS_TURN":
      return true; // checked at caller
    default:
      return true;
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
