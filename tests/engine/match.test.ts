import { describe, it, expect } from "vitest";
import { initMatch } from "../../src/engine/match";
import { CARDS_BY_FACTION } from "../../src/engine/cards";

describe("initMatch", () => {
  function defaults() {
    return {
      p1Faction: "ATTACKER" as const,
      p1Deck: CARDS_BY_FACTION.ATTACKER.slice(0, 8),
      p2Faction: "DEFENDER" as const,
      p2Deck: CARDS_BY_FACTION.DEFENDER.slice(0, 8),
      seed: 42,
    };
  }

  it("creates a match with turn=1, 3 targets, both players with 8 cards", () => {
    const m = initMatch(defaults());
    expect(m.turn).toBe(1);
    expect(m.targets.length).toBe(3);
    expect(m.p1.deck.length + m.p1.hand.length).toBe(8);
    expect(m.p2.deck.length + m.p2.hand.length).toBe(8);
    expect(m.winner).toBe(null);
  });

  it("deals 3 cards to each player's hand on turn 1", () => {
    const m = initMatch(defaults());
    expect(m.p1.hand.length).toBe(3);
    expect(m.p2.hand.length).toBe(3);
  });

  it("gives both players 1 energy on turn 1", () => {
    const m = initMatch(defaults());
    expect(m.p1.energy).toBe(1);
    expect(m.p2.energy).toBe(1);
  });

  it("targets all start at score 0, not locked", () => {
    const m = initMatch(defaults());
    m.targets.forEach(t => {
      expect(t.score).toBe(0);
      expect(t.locked).toBe(false);
      expect(t.cardsPlayed.length).toBe(0);
    });
  });

  it("uses seed for deterministic shuffles", () => {
    const a = initMatch(defaults());
    const b = initMatch(defaults());
    expect(a.p1.hand.map(c => c.id)).toEqual(b.p1.hand.map(c => c.id));
  });
});
