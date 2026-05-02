import { motion, AnimatePresence } from "framer-motion";
import type { TargetState } from "../engine/types";
import { CardView } from "./CardView";

interface Props {
  target: TargetState;
  onClick?: () => void;
  highlighted?: boolean;
}

export function TargetView({ target, onClick, highlighted }: Props) {
  const score = target.score;
  const breachLevel = Math.max(0, Math.min(10, score));
  const secureLevel = Math.max(0, Math.min(10, -score));

  return (
    <motion.div
      onClick={onClick}
      animate={{ x: 0 }}
      whileHover={{ x: 0 }}
      key={target.id}
      className={`rounded-xl bg-panel/70 border ${
        highlighted ? "border-accent" : "border-panel"
      } p-3 cursor-pointer hover:border-accent/60 transition flex flex-col gap-2`}
    >
      <motion.div
        key={`shake-${score}`}
        animate={score !== 0 ? { x: [0, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-2"
      >
        <div className="flex justify-between items-baseline">
          <div className="font-display text-xs uppercase tracking-wide">
            {target.name}
          </div>
          {target.locked && (
            <span className="text-[10px] text-rose-400">🔒 LOCKED</span>
          )}
        </div>
        <div className="relative h-2 bg-black/40 rounded-full overflow-hidden">
          <motion.div
            className="absolute right-1/2 top-0 h-full bg-cyan-400"
            animate={{ width: `${(secureLevel / 10) * 50}%` }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="absolute left-1/2 top-0 h-full bg-rose-500"
            animate={{ width: `${(breachLevel / 10) * 50}%` }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute left-1/2 top-0 h-full w-px bg-white/40" />
        </div>
        <div className="text-center text-xs font-mono">
          {score > 0 && <span className="text-rose-400">+{score} BREACH</span>}
          {score < 0 && <span className="text-cyan-400">{score} SECURE</span>}
          {score === 0 && <span className="opacity-60">— neutral —</span>}
        </div>
      </motion.div>
      <div className="flex gap-1 flex-wrap justify-center min-h-[64px]">
        <AnimatePresence>
          {target.cardsPlayed.map((p, i) => (
            <motion.div
              key={`${p.card.id}-${p.turn}-${i}`}
              initial={{ y: -20, opacity: 0, rotate: -8 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <CardView card={p.card} size="sm" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
