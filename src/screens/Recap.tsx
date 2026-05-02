import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { cardById } from "../engine/cards";
import { trackEvent } from "../analytics/posthog";
import { Logo8Bit } from "../components/Logo8Bit";
import { sfx } from "../utils/sound";

export function RecapScreen() {
  const recap = useGameStore((s) => s.recap);
  const match = useGameStore((s) => s.match);
  const openLearnMore = useGameStore((s) => s.openLearnMore);
  const reset = useGameStore((s) => s.resetForNextMatch);
  const [shownAt] = useState(Date.now());
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    if (recap) trackEvent("recap_shown", { lessonId: recap.id, cardId: recap.cardId });
    if (match?.winner === "P1") sfx.victory();
    else if (match?.winner === "DRAW") sfx.draw();
    else if (match?.winner === "P2") sfx.defeat();
    const t = setTimeout(() => setIntroVisible(false), 1400);
    return () => clearTimeout(t);
  }, [recap, match?.winner]);

  if (!recap || !match) return null;
  const card = cardById(recap.cardId);
  const won = match.winner === "P1";
  const draw = match.winner === "DRAW";

  const result = won ? "VICTORY" : draw ? "DRAW" : "DEFEAT";
  const resultColor = won
    ? "text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.8)]"
    : draw
    ? "text-amber-300 drop-shadow-[0_0_30px_rgba(252,211,77,0.7)]"
    : "text-rose-400 drop-shadow-[0_0_30px_rgba(251,113,133,0.8)]";

  const onSkip = () => {
    const elapsed = Date.now() - shownAt;
    if (elapsed < 3000) trackEvent("recap_skipped", { elapsed_ms: elapsed });
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4 relative overflow-hidden">
      <Logo8Bit scale={0.55} className="opacity-80" />
      <AnimatePresence>
        {introVisible && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-bg/95"
            onClick={() => setIntroVisible(false)}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: won ? -8 : 8 }}
              animate={{ scale: [0.3, 1.15, 1], opacity: 1, rotate: 0 }}
              transition={{ duration: 0.6, times: [0, 0.7, 1] }}
              className={`font-display font-bold text-6xl sm:text-8xl tracking-widest ${resultColor}`}
            >
              {result}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: introVisible ? 0 : 1, y: introVisible ? 20 : 0 }}
        transition={{ duration: 0.4 }}
        className="bg-panel rounded-2xl p-6 max-w-md w-full flex flex-col gap-4"
      >
        <div className="flex justify-between items-baseline">
          <div className={`font-display text-2xl ${resultColor}`}>{result}</div>
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
      </motion.div>
    </div>
  );
}
