import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { learnMoreFor } from "../engine/learn-more";
import { trackEvent } from "../analytics/posthog";
import { Logo8Bit } from "../components/Logo8Bit";

export function LearnMoreScreen() {
  const cardId = useGameStore((s) => s.learnMoreCardId);
  const close = useGameStore((s) => s.closeLearnMore);
  const [openedAt] = useState(Date.now());

  if (!cardId) return null;
  const lm = learnMoreFor(cardId);
  if (!lm) return null;

  const onDone = () => {
    const elapsed = Date.now() - openedAt;
    if (elapsed >= 8000) {
      trackEvent("learn_more_completed", { cardId, elapsed_ms: elapsed });
    }
    close();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4">
      <Logo8Bit scale={0.55} className="opacity-80" />
      <div className="bg-panel rounded-2xl p-6 max-w-md w-full flex flex-col gap-4">
        <div className="font-display text-xl text-accent">{lm.title}</div>

        <section className="flex flex-col gap-1">
          <div className="font-display uppercase text-xs opacity-60">What it is</div>
          <p className="text-sm leading-relaxed">{lm.whatItIs}</p>
        </section>

        <section className="flex flex-col gap-1">
          <div className="font-display uppercase text-xs opacity-60">How to spot it IRL</div>
          <ul className="text-sm leading-relaxed list-disc pl-5">
            {lm.spotItIRL.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-1">
          <div className="font-display uppercase text-xs opacity-60">How to defend</div>
          <ul className="text-sm leading-relaxed list-disc pl-5">
            {lm.howToDefend.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <button
          onClick={onDone}
          className="bg-accent text-bg font-display py-2 rounded-lg uppercase text-sm hover:bg-accent/80"
        >
          Got it — +15 XP ▶
        </button>
      </div>
    </div>
  );
}
