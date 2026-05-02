import { describe, it, expect } from "vitest";
import { initMatch, playCards, advanceTurn } from "../../src/engine/match";
import { CARDS_BY_FACTION, cardById } from "../../src/engine/cards";
import { chooseAIPlays } from "../../src/engine/ai";

describe("AI", () => {
  it("returns plays the AI can afford", () => {
    const m = initMatch({
      p1Faction: "ATTACKER", p1Deck: CARDS_BY_FACTION.ATTACKER.slice(0, 8),
      p2Faction: "DEFENDER", p2Deck: CARDS_BY_FACTION.DEFENDER.slice(0, 8),
      seed: 1,
    });
    const plays = chooseAIPlays(m, "P2", "medium");
    const totalEnergy = plays.reduce((s, i) => {
      const c = m.p2.hand.find(x => x.id === i.cardId)!;
      return s + c.energy;
    }, 0);
    expect(totalEnergy).toBeLessThanOrEqual(m.p2.energy);
  });

  it("returns no plays if hand is empty", () => {
    const m = initMatch({
      p1Faction: "ATTACKER", p1Deck: CARDS_BY_FACTION.ATTACKER.slice(0, 8),
      p2Faction: "DEFENDER", p2Deck: CARDS_BY_FACTION.DEFENDER.slice(0, 8),
      seed: 1,
    });
    m.p2.hand = [];
    const plays = chooseAIPlays(m, "P2", "medium");
    expect(plays.length).toBe(0);
  });

  it("hard AI plays MFA on a target threatened by Brute Force", () => {
    const m = initMatch({
      p1Faction: "ATTACKER", p1Deck: CARDS_BY_FACTION.ATTACKER.slice(0, 8),
      p2Faction: "DEFENDER", p2Deck: CARDS_BY_FACTION.DEFENDER.slice(0, 8),
      seed: 1,
    });
    // Simulate previous turn: P1 played BFB on target[0]
    m.targets[0].cardsPlayed.push({ card: cardById("BRUTE_FORCE_BOT"), player: "P1", turn: 1 });
    m.targets[0].score = 6;
    // Force AI hand and energy
    m.p2.hand = [cardById("MFA"), cardById("PATCH_TUESDAY"), cardById("PATCH_TUESDAY")];
    m.p2.energy = 2;

    const plays = chooseAIPlays(m, "P2", "hard");
    const mfaPlay = plays.find(p => p.cardId === "MFA");
    expect(mfaPlay).toBeDefined();
    expect(mfaPlay?.targetId).toBe(m.targets[0].id);
  });
});

describe("AI-vs-AI full match", () => {
  it("finishes a full match without errors and produces a winner", () => {
    let m = initMatch({
      p1Faction: "ATTACKER", p1Deck: CARDS_BY_FACTION.ATTACKER.slice(0, 8),
      p2Faction: "DEFENDER", p2Deck: CARDS_BY_FACTION.DEFENDER.slice(0, 8),
      seed: 7,
    });
    let safety = 20;
    while (m.phase !== "END" && safety-- > 0) {
      const p1 = chooseAIPlays(m, "P1", "medium");
      const p2 = chooseAIPlays(m, "P2", "medium");
      m = playCards(m, p1, p2);
      m = advanceTurn(m);
    }
    expect(m.phase).toBe("END");
    expect(["P1", "P2", "DRAW"]).toContain(m.winner);
  });
});
