import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { cardById } from "../engine/cards";
import { trackEvent } from "../analytics/posthog";

export function RecapScreen() {
  const recap = useGameStore((s) => s.recap);
  const match = useGameStore((s) => s.match);
  const openLearnMore = useGameStore((s) => s.openLearnMore);
  const reset = useGameStore((s) => s.resetForNextMatch);
  const [shownAt] = useState(Date.now());

  useEffect(() => {
    if (recap) trackEvent("recap_shown", { lessonId: recap.id, cardId: recap.cardId });
  }, [recap]);

  if (!recap || !match) return null;
  const card = cardById(recap.cardId);
  const won = match.winner === "P1";
  const draw = match.winner === "DRAW";

  const onSkip = () => {
    const elapsed = Date.now() - shownAt;
    if (elapsed < 3000) trackEvent("recap_skipped", { elapsed_ms: elapsed });
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-panel rounded-2xl p-6 max-w-md w-full flex flex-col gap-4">
        <div className="flex justify-between items-baseline">
          <div className="font-display text-2xl">
            {won ? "VICTORY" : draw ? "DRAW" : "DEFEAT"}
          </div>
          <div className="text-xs opacity-60">Match recap</div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <img
            src={card.art}
            alt={card.name}
            className="w-24 h-32 object-contain rounded-lg bg-black/30"
            onError={(e) => ((e.currentTarget.style.display = "none"))}
          />
        </div>

        <div className="text-center font-display uppercase text-xs opacity-70">
          Your winning play
        </div>
        <div className="text-center text-xl font-display">{recap.headline}</div>

        <hr className="border-white/10" />

        <p className="text-sm leading-relaxed text-center">"{recap.body}"</p>

        <button
          onClick={() => {
            trackEvent("learn_more_opened", { cardId: recap.cardId, lessonId: recap.id });
            openLearnMore(recap.learnMoreId);
          }}
          className="bg-accent/30 border border-accent text-accent font-display py-2 rounded-lg uppercase text-sm hover:bg-accent/50"
        >
          📖 Learn More — +15 XP
        </button>

        <button
          onClick={onSkip}
          className="bg-white/10 hover:bg-white/20 font-display py-2 rounded-lg uppercase text-sm"
        >
          Next match ▶
        </button>
      </div>
    </div>
  );
}
