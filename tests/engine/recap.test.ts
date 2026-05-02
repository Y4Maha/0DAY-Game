import { describe, it, expect } from "vitest";
import { selectRecapLesson } from "../../src/engine/recap";
import { initMatch, playCards } from "../../src/engine/match";
import { CARDS_BY_FACTION, cardById } from "../../src/engine/cards";

function setupMatch(seed = 1) {
  return initMatch({
    p1Faction: "ATTACKER", p1Deck: CARDS_BY_FACTION.ATTACKER.slice(0, 8),
    p2Faction: "DEFENDER", p2Deck: CARDS_BY_FACTION.DEFENDER.slice(0, 8),
    seed,
  });
}

describe("recap lesson selection", () => {
  it("PHISHING_PIPELINE when P1 chained Phishing → Stolen Creds → Brute Force on same target", () => {
    let m = setupMatch();
    m.p1.hand = [cardById("PHISHING_LURE"), cardById("STOLEN_CREDENTIALS"), cardById("BRUTE_FORCE_BOT")];
    m.p1.energy = 7;
    const t0 = m.targets[0].id;
    m = playCards(m, [
      { player: "P1", cardId: "PHISHING_LURE", targetId: t0 },
      { player: "P1", cardId: "STOLEN_CREDENTIALS", targetId: t0 },
      { player: "P1", cardId: "BRUTE_FORCE_BOT", targetId: t0 },
    ], []);
    const lesson = selectRecapLesson(m, "P1");
    expect(lesson.id).toBe("PHISHING_PIPELINE");
  });

  it("NO_MFA when P1 won via Brute Force on no-MFA target", () => {
    let m = setupMatch();
    m.p1.hand = [cardById("BRUTE_FORCE_BOT")];
    m.p1.energy = 2;
    m = playCards(m, [{ player: "P1", cardId: "BRUTE_FORCE_BOT", targetId: m.targets[0].id }], []);
    const lesson = selectRecapLesson(m, "P1");
    expect(lesson.id).toBe("NO_MFA");
  });

  it("RANSOMWARE_NO_BACKUP when P1 played Ransomware unblocked", () => {
    let m = setupMatch();
    m.p1.hand = [cardById("RANSOMWARE")];
    m.p1.energy = 4;
    m = playCards(m, [{ player: "P1", cardId: "RANSOMWARE", targetId: m.targets[0].id }], []);
    const lesson = selectRecapLesson(m, "P1");
    expect(lesson.id).toBe("RANSOMWARE_NO_BACKUP");
  });

  it("BACKUP_BLOCKED_RANSOM when P2 blocked Ransomware with Backup Vault", () => {
    let m = setupMatch();
    m.p1.hand = [cardById("RANSOMWARE")];
    m.p1.energy = 4;
    m.p2.hand = [cardById("BACKUP_VAULT")];
    m.p2.energy = 4;
    m = playCards(m,
      [{ player: "P1", cardId: "RANSOMWARE", targetId: m.targets[0].id }],
      [{ player: "P2", cardId: "BACKUP_VAULT", targetId: m.targets[0].id }]);
    const lesson = selectRecapLesson(m, "P2");
    expect(lesson.id).toBe("BACKUP_BLOCKED_RANSOM");
  });

  it("falls back to highest-energy card when no rule matches", () => {
    let m = setupMatch();
    m.p1.hand = [cardById("PHISHING_LURE")];
    m.p1.energy = 2;
    m = playCards(m, [{ player: "P1", cardId: "PHISHING_LURE", targetId: m.targets[0].id }], []);
    const lesson = selectRecapLesson(m, "P1");
    expect(lesson.id).toBe("FALLBACK_PHISHING_LURE");
  });
});
