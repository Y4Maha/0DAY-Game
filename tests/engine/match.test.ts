import { describe, it, expect } from "vitest";
import { initMatch, advanceTurn, playCards } from "../../src/engine/match";
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

describe("playCards + advanceTurn", () => {
  function setup() {
    return initMatch({
      p1Faction: "ATTACKER",
      p1Deck: CARDS_BY_FACTION.ATTACKER.slice(0, 8),
      p2Faction: "DEFENDER",
      p2Deck: CARDS_BY_FACTION.DEFENDER.slice(0, 8),
      seed: 42,
    });
  }

  it("plays a card and removes it from hand", () => {
    let m = setup();
    // find first affordable card (energy <= current energy)
    const handCard = m.p1.hand.find(c => c.energy <= m.p1.energy)!;
    const targetId = m.targets[0].id;
    m = playCards(m, [{ player: "P1", cardId: handCard.id, targetId }], []);
    expect(m.p1.hand.find(c => c.id === handCard.id)).toBeUndefined();
    expect(m.targets[0].cardsPlayed.find(p => p.card.id === handCard.id)).toBeDefined();
  });

  it("rejects playing a card the player can't afford", () => {
    const m = setup();
    const expensive = m.p1.hand.find(c => c.energy > 1);
    if (expensive) {
      expect(() => playCards(m, [{ player: "P1", cardId: expensive.id, targetId: m.targets[0].id }], []))
        .toThrow(/insufficient energy/i);
    }
  });

  it("advanceTurn increments turn, increases energy, draws a card", () => {
    let m = setup();
    m = advanceTurn(m);
    expect(m.turn).toBe(2);
    expect(m.p1.energy).toBe(2);
    expect(m.p2.energy).toBe(2);
    expect(m.p1.hand.length).toBe(4);
    expect(m.p2.hand.length).toBe(4);
  });

  it("ends the match after turn 6", () => {
    let m = setup();
    for (let i = 0; i < 5; i++) m = advanceTurn(m);
    expect(m.turn).toBe(6);
    m = advanceTurn(m);
    expect(m.phase).toBe("END");
    expect(m.winner).not.toBe(null);
  });
});

describe("full match", () => {
  it("ends after turn 6 with a defined winner", () => {
    let m = initMatch({
      p1Faction: "ATTACKER",
      p1Deck: CARDS_BY_FACTION.ATTACKER.slice(0, 8),
      p2Faction: "DEFENDER",
      p2Deck: CARDS_BY_FACTION.DEFENDER.slice(0, 8),
      seed: 7,
    });
    for (let i = 0; i < 6; i++) m = advanceTurn(m);
    expect(m.phase).toBe("END");
    expect(["P1", "P2", "DRAW"]).toContain(m.winner);
  });
});
