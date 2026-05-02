import { describe, it, expect } from "vitest";
import { initMatch, playCards, advanceTurn } from "../../src/engine/match";
import { cardById } from "../../src/engine/cards";

function makeMatch(p1Cards: string[], p2Cards: string[], seed = 1) {
  const p1Deck = p1Cards.map(cardById);
  const p2Deck = p2Cards.map(cardById);
  return initMatch({
    p1Faction: p1Deck[0].faction, p1Deck,
    p2Faction: p2Deck[0].faction, p2Deck,
    seed,
  });
}

describe("simple effects", () => {
  it("Phishing Lure (P1 attacker) adds +3 to score", () => {
    let m = makeMatch(
      Array(8).fill("PHISHING_LURE"),
      Array(8).fill("PATCH_TUESDAY")
    );
    m = advanceTurn(m); // turn 2, energy 2
    const phishing = m.p1.hand.find(c => c.id === "PHISHING_LURE")!;
    m = playCards(m, [{ player: "P1", cardId: phishing.id, targetId: m.targets[0].id }], []);
    expect(m.targets[0].score).toBe(3);
  });

  it("Patch Tuesday (P2 defender) adds -2 to score", () => {
    let m = makeMatch(
      Array(8).fill("PHISHING_LURE"),
      Array(8).fill("PATCH_TUESDAY")
    );
    const patch = m.p2.hand.find(c => c.id === "PATCH_TUESDAY")!;
    m = playCards(m, [], [{ player: "P2", cardId: patch.id, targetId: m.targets[0].id }]);
    expect(m.targets[0].score).toBe(-2);
  });
});
