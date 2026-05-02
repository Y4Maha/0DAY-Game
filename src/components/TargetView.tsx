import { motion, AnimatePresence } from "framer-motion";
import type { Card, TargetState } from "../engine/types";

interface Props {
  target: TargetState;
  onClick?: () => void;
  highlighted?: boolean;
  stagedCards?: Card[];
}

interface ChipProps {
  card: Card;
  staged?: boolean;
}

function PlayChip({ card, staged }: ChipProps) {
  const colorBg =
    card.faction === "ATTACKER"
      ? "bg-rose-700/80 border-rose-400"
      : "bg-cyan-700/80 border-cyan-400";
  return (
    <div
      title={`${card.name} (${card.energy}⚡)`}
      className={`flex items-center gap-1 rounded-full border ${colorBg} px-1.5 py-0.5 text-[10px] font-display ${
        staged ? "ring-1 ring-accent ring-offset-1 ring-offset-panel opacity-90" : ""
      }`}
    >
      <span className="font-bold text-white">{card.energy}</span>
      <span className="opacity-80 max-w-[5rem] truncate hidden sm:inline">
        {card.name}
      </span>
    </div>
  );
}

export function TargetView({ target, onClick, highlighted, stagedCards = [] }: Props) {
  const score = target.score;
  const breachLevel = Math.max(0, Math.min(10, score));
  const secureLevel = Math.max(0, Math.min(10, -score));
  const hasStaged = stagedCards.length > 0;

  return (
    <motion.div
      onClick={onClick}
      animate={{
        scale: hasStaged ? [1, 1.04, 1] : 1,
        x: 0,
      }}
      transition={{ duration: 0.35 }}
      whileHover={{ x: 0 }}
      key={target.id}
      className={`rounded-xl bg-panel/70 border-2 ${
        hasStaged
          ? "border-accent shadow-[0_0_18px_rgba(167,139,250,0.55)]"
          : highlighted
          ? "border-accent animate-pulse"
          : "border-panel"
      } p-2 sm:p-3 cursor-pointer hover:border-accent/60 transition flex flex-col gap-1.5`}
    >
      <motion.div
        key={`shake-${score}`}
        animate={score !== 0 ? { x: [0, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-1.5"
      >
        <div className="flex justify-between items-baseline gap-1">
          <div className="font-display text-[10px] sm:text-xs uppercase tracking-wide truncate">
            {target.name}
          </div>
          {target.locked && (
            <span className="text-[9px] text-rose-400">🔒</span>
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
        <div className="text-center text-[10px] sm:text-xs font-mono">
          {score > 0 && <span className="text-rose-400">+{score} BREACH</span>}
          {score < 0 && <span className="text-cyan-400">{score} SECURE</span>}
          {score === 0 && <span className="opacity-60">— neutral —</span>}
        </div>
      </motion.div>
      <div className="flex gap-1 flex-wrap justify-center min-h-[28px]">
        <AnimatePresence>
          {target.cardsPlayed.map((p, i) => (
            <motion.div
              key={`${p.card.id}-${p.turn}-${i}`}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <PlayChip card={p.card} />
            </motion.div>
          ))}
          {stagedCards.map((c) => (
            <motion.div
              key={`staged-${c.id}`}
              initial={{ y: -10, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
            >
              <PlayChip card={c} staged />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
