import { describe, it, expect } from "vitest";
import { LEARN_MORE } from "../../src/engine/learn-more";
import { CARDS } from "../../src/engine/cards";

describe("Learn More content", () => {
  it("has content for every card", () => {
    for (const c of CARDS) {
      expect(LEARN_MORE[c.id]).toBeDefined();
    }
  });
  it("each entry has whatItIs ≥50 chars, exactly 3 spotItIRL bullets, exactly 3 howToDefend bullets", () => {
    for (const id of Object.keys(LEARN_MORE)) {
      const e = LEARN_MORE[id];
      expect(e.whatItIs.length).toBeGreaterThanOrEqual(50);
      expect(e.spotItIRL.length).toBe(3);
      expect(e.howToDefend.length).toBe(3);
    }
  });
});
