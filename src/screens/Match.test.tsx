import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MatchScreen } from "./Match";
import { useGameStore } from "../store/gameStore";
import { CARDS_BY_FACTION } from "../engine/cards";

function startTestMatch() {
  const store = useGameStore.getState();
  store.setFaction("ATTACKER");
  CARDS_BY_FACTION.ATTACKER.slice(0, 8).forEach((c) => store.toggleCardSelected(c.id));
  store.startMatch();
}

describe("MatchScreen turn-1 playability", () => {
  beforeEach(() => {
    useGameStore.setState({
      screen: "LANDING",
      faction: null,
      selectedCards: [],
      match: null,
      pendingPlays: [],
      recap: null,
      learnMoreCardId: null,
    });
  });

  it("at least one card in the starting hand is playable on turn 1", () => {
    startTestMatch();
    const match = useGameStore.getState().match!;
    const playable = match.p1.hand.filter((c) => c.energy <= match.p1.energy);
    expect(
      playable.length,
      `starting hand: ${match.p1.hand.map((c) => `${c.name}(${c.energy})`).join(", ")} | energy: ${match.p1.energy}`
    ).toBeGreaterThan(0);
  });

  it("clicking a playable card then a target stages the play", async () => {
    const user = userEvent.setup();
    startTestMatch();
    render(<MatchScreen />);

    const match = useGameStore.getState().match!;
    const playableCard = match.p1.hand.find((c) => c.energy <= match.p1.energy)!;
    expect(playableCard).toBeTruthy();

    const cardBtn = screen
      .getAllByRole("button")
      .find((b) => b.textContent?.includes(playableCard.name) && !b.hasAttribute("disabled"));
    expect(cardBtn).toBeTruthy();

    await user.click(cardBtn!);
    expect(screen.getByText(/Tap a target to play this card/i)).toBeInTheDocument();

    const targetEl = screen.getByText(match.targets[0].name);
    await user.click(targetEl);

    const pending = useGameStore.getState().pendingPlays;
    expect(pending).toHaveLength(1);
    expect(pending[0].cardId).toBe(playableCard.id);
    expect(pending[0].targetId).toBe(match.targets[0].id);
  });
});
