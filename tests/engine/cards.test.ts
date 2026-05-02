import { describe, it, expect } from "vitest";
import { CARDS, CARDS_BY_FACTION } from "../../src/engine/cards";

describe("card data", () => {
  it("has 20 cards total", () => expect(CARDS.length).toBe(20));
  it("has 10 attackers", () => expect(CARDS_BY_FACTION.ATTACKER.length).toBe(10));
  it("has 10 defenders", () => expect(CARDS_BY_FACTION.DEFENDER.length).toBe(10));
  it("all cards have unique ids", () => {
    const ids = CARDS.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("all cards have energy 1-6", () => {
    CARDS.forEach(c => {
      expect(c.energy).toBeGreaterThanOrEqual(1);
      expect(c.energy).toBeLessThanOrEqual(6);
    });
  });
  it("all cards have non-empty flavor", () => {
    CARDS.forEach(c => expect(c.flavor.length).toBeGreaterThan(20));
  });
});
