import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { TargetView } from "../components/TargetView";
import { HandView } from "../components/HandView";
import { EnergyBar } from "../components/EnergyBar";

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

  const onCardClick = (cardId: string) => {
    const isStaged = pendingPlays.some((p) => p.cardId === cardId);
    if (isStaged) {
      unstagePlay(cardId);
      setActiveCardId(null);
    } else {
      setActiveCardId(cardId);
    }
  };

  const onTargetClick = (targetId: string) => {
    if (!activeCardId) return;
    stagePlay({ player: "P1", cardId: activeCardId, targetId });
    setActiveCardId(null);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4">
      <div className="flex justify-between items-center">
        <div className="font-display text-lg">0DAY</div>
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
            />
          ))}
        </div>

        {activeCardId && (
          <div className="text-center text-xs opacity-80">
            Tap a target to play this card. Tap card again to cancel.
          </div>
        )}

        {handLocked && !activeCardId && (
          <div className="text-center text-xs text-accent">
            No playable cards this turn — press End Turn ▶
          </div>
        )}

        <HandView
          hand={match.p1.hand}
          selectedCardIds={pendingPlays.map((p) => p.cardId)}
          energyAvailable={energyAvailable}
          onCardClick={onCardClick}
        />

        <button
          onClick={resolveTurn}
          className="bg-accent text-bg font-display font-bold py-3 rounded-lg uppercase tracking-wide hover:bg-accent/80 transition"
        >
          End Turn ▶
        </button>
      </div>
    </div>
  );
}
