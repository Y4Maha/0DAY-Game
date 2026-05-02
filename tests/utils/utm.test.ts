import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { captureUtm } from "../../src/utils/utm";

describe("captureUtm", () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset window.location.search via JSDOM
    Object.defineProperty(window, "location", {
      writable: true,
      value: new URL("https://example.com/?utm_source=reddit&utm_campaign=demo-launch"),
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("captures UTM tags from URL", () => {
    const tags = captureUtm();
    expect(tags.source).toBe("reddit");
    expect(tags.campaign).toBe("demo-launch");
  });

  it("first-touch attribution: subsequent reads return original tags", () => {
    captureUtm(); // first-touch save
    Object.defineProperty(window, "location", {
      writable: true,
      value: new URL("https://example.com/?utm_source=hn"),
    });
    const tags = captureUtm();
    expect(tags.source).toBe("reddit"); // unchanged
  });
});
