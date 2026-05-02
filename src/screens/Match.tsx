import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { TargetView } from "../components/TargetView";
import { HandView } from "../components/HandView";
import { EnergyBar } from "../components/EnergyBar";
import { Logo8Bit } from "../components/Logo8Bit";
import { sfx } from "../utils/sound";

export function MatchScreen() {
  const match = useGameStore((s) => s.match);
  const pendingPlays = useGameStore((s) => s.pendingPlays);
  const stagePlay = useGameStore((s) => s.stagePlay);
  const unstagePlay = useGameStore((s) => s.unstagePlay);
  const resolveTurn = useGameStore((s) => s.resolveTurn);

  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  if (!match) return <div className="p-6">Loading...</div>;

  const energyUsed = pendingPlays.reduce((sum, p) => {
    const c = match.p1.hand.find((x) => x.id === p.cardId);
    return sum + (c?.energy ?? 0);
  }, 0);
  const energyAvailable = match.p1.energy - energyUsed;
  const handLocked =
    pendingPlays.length === 0 &&
    match.p1.hand.length > 0 &&
    match.p1.hand.every((c) => c.energy > energyAvailable);

  const stagedCardsByTarget = (targetId: string) =>
    pendingPlays
      .filter((p) => p.targetId === targetId)
      .map((p) => match.p1.hand.find((c) => c.id === p.cardId))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const onCardClick = (cardId: string) => {
    const isStaged = pendingPlays.some((p) => p.cardId === cardId);
    if (isStaged) {
      sfx.cardCancel();
      unstagePlay(cardId);
      setActiveCardId(null);
    } else {
      sfx.cardPick();
      setActiveCardId(cardId);
    }
  };

  const onTargetClick = (targetId: string) => {
    if (!activeCardId) return;
    sfx.cardStage();
    stagePlay({ player: "P1", cardId: activeCardId, targetId });
    setActiveCardId(null);
  };

  const onEndTurn = () => {
    sfx.endTurn();
    resolveTurn();
  };

  let hint: { text: string; tone: "neutral" | "accent" | "warn" };
  if (activeCardId) {
    hint = {
      text: "Step 2 — tap a target to play this card. Tap the card again to cancel.",
      tone: "accent",
    };
  } else if (handLocked) {
    hint = {
      text: "No playable cards this turn — press End Turn ▶",
      tone: "warn",
    };
  } else if (pendingPlays.length === 0) {
    hint = {
      text: "Step 1 — tap a card from your hand to begin",
      tone: "neutral",
    };
  } else {
    hint = {
      text: "Press End Turn ▶ to resolve, or stage another card",
      tone: "accent",
    };
  }

  const hintColor =
    hint.tone === "accent"
      ? "text-accent"
      : hint.tone === "warn"
      ? "text-rose-300"
      : "opacity-80";

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4">
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <Logo8Bit scale={0.55} />
        <EnergyBar
          current={energyAvailable}
          max={match.p1.energy}
          turn={match.turn}
          totalTurns={6}
        />
      </div>

      <div className="flex-1 flex flex-col gap-3 max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {match.targets.map((t) => (
            <TargetView
              key={t.id}
              target={t}
              onClick={() => onTargetClick(t.id)}
              highlighted={activeCardId !== null && !t.locked}
              stagedCards={stagedCardsByTarget(t.id)}
            />
          ))}
        </div>

        <div className={`text-center text-sm font-display tracking-wide ${hintColor}`}>
          {hint.text}
        </div>

        <HandView
          hand={match.p1.hand}
          selectedCardIds={pendingPlays.map((p) => p.cardId)}
          energyAvailable={energyAvailable}
          onCardClick={onCardClick}
        />

        <button
          onClick={onEndTurn}
          className="bg-accent text-bg font-display font-bold py-3 rounded-lg uppercase tracking-wide hover:bg-accent/80 transition"
        >
          End Turn ▶
        </button>
      </div>
    </div>
  );
}
