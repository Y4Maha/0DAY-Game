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

describe("conditional effects", () => {
  it("Brute Force Bot deals +6 if no MFA, +1 if MFA on target", () => {
    let m = makeMatch(
      Array(8).fill("BRUTE_FORCE_BOT"),
      Array(8).fill("MFA")
    );
    m = advanceTurn(m); // turn 2

    const bfb = m.p1.hand.find(c => c.id === "BRUTE_FORCE_BOT")!;
    const mfa = m.p2.hand.find(c => c.id === "MFA")!;
    const tNoMFA = m.targets[1].id;
    const tMFA = m.targets[0].id;

    // Target without MFA — full damage +6
    let m1 = playCards(m, [{ player: "P1", cardId: bfb.id, targetId: tNoMFA }], []);
    expect(m1.targets[1].score).toBe(6);

    // Target with MFA: P2 plays MFA (-2), P1 plays BFB +1 → score = -2 + 1 = -1
    let m2 = playCards(m,
      [{ player: "P1", cardId: bfb.id, targetId: tMFA }],
      [{ player: "P2", cardId: mfa.id, targetId: tMFA }]);
    expect(m2.targets[0].score).toBe(-1);
  });

  it("Stolen Credentials gets +2 per Phishing/OSINT this player previously played", () => {
    let m = makeMatch(
      ["PHISHING_LURE","STOLEN_CREDENTIALS","PHISHING_LURE","PHISHING_LURE","PHISHING_LURE","PHISHING_LURE","PHISHING_LURE","PHISHING_LURE"],
      Array(8).fill("PATCH_TUESDAY"),
      99
    );

    // Force P1's hand for determinism
    const phishing = cardById("PHISHING_LURE");
    const stolen = cardById("STOLEN_CREDENTIALS");
    m.p1.hand = [phishing, stolen, phishing];
    m.p1.deck = [phishing, phishing, phishing, phishing, phishing];

    // Turn 1: play 1 Phishing on target[0] (energy 1 too low for Phishing energy 2; advance first)
    m = advanceTurn(m); // turn 2, energy 2
    m = playCards(m, [{ player: "P1", cardId: "PHISHING_LURE", targetId: m.targets[0].id }], []);
    expect(m.targets[0].score).toBe(3);

    // Turn 3
    m = advanceTurn(m); // energy 3
    // Play Stolen Credentials (energy 3) — should be +4 base + +2 per prior Phishing/OSINT this player played
    // Prior plays by P1: 1 Phishing → bonus = 2
    m = playCards(m, [{ player: "P1", cardId: "STOLEN_CREDENTIALS", targetId: m.targets[0].id }], []);
    // Score before: 3. Then Stolen adds: +4 + 2*1 = +6. Final: 3 + 6 = 9
    expect(m.targets[0].score).toBe(9);
  });

  it("Ransomware locks target", () => {
    let m = makeMatch(
      Array(8).fill("RANSOMWARE"),
      Array(8).fill("PATCH_TUESDAY"),
      5
    );
    m.p1.hand = [cardById("RANSOMWARE"), cardById("RANSOMWARE"), cardById("RANSOMWARE")];
    m.p1.energy = 4;

    m = playCards(m, [{ player: "P1", cardId: "RANSOMWARE", targetId: m.targets[0].id }], []);
    expect(m.targets[0].locked).toBe(true);
  });

  it("Backup Vault negates Ransomware (Ransomware effects do not apply)", () => {
    let m = makeMatch(
      Array(8).fill("RANSOMWARE"),
      Array(8).fill("BACKUP_VAULT"),
      5
    );
    m.p1.hand = [cardById("RANSOMWARE")];
    m.p1.energy = 4;
    m.p2.hand = [cardById("BACKUP_VAULT")];
    m.p2.energy = 4;

    m = playCards(m,
      [{ player: "P1", cardId: "RANSOMWARE", targetId: m.targets[0].id }],
      [{ player: "P2", cardId: "BACKUP_VAULT", targetId: m.targets[0].id }]);
    // Ransomware negated → only Backup Vault's SECURE +4 resolves: -4
    expect(m.targets[0].score).toBe(-4);
    expect(m.targets[0].locked).toBe(false);
  });
});
