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
    <div
      onClick={onClick}
      className={`rounded-xl bg-panel/70 border ${
        highlighted ? "border-accent" : "border-panel"
      } p-3 cursor-pointer hover:border-accent/60 transition flex flex-col gap-2`}
    >
      <div className="flex justify-between items-baseline">
        <div className="font-display text-xs uppercase tracking-wide">
          {target.name}
        </div>
        {target.locked && <span className="text-[10px] text-rose-400">🔒 LOCKED</span>}
      </div>
      <div className="relative h-2 bg-black/40 rounded-full overflow-hidden">
        <div
          className="absolute right-1/2 top-0 h-full bg-cyan-400"
          style={{ width: `${(secureLevel / 10) * 50}%` }}
        />
        <div
          className="absolute left-1/2 top-0 h-full bg-rose-500"
          style={{ width: `${(breachLevel / 10) * 50}%` }}
        />
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/40" />
      </div>
      <div className="text-center text-xs font-mono">
        {score > 0 && <span className="text-rose-400">+{score} BREACH</span>}
        {score < 0 && <span className="text-cyan-400">{score} SECURE</span>}
        {score === 0 && <span className="opacity-60">— neutral —</span>}
      </div>
      <div className="flex gap-1 flex-wrap justify-center min-h-[64px]">
        {target.cardsPlayed.map((p, i) => (
          <CardView key={`${p.card.id}-${p.turn}-${i}`} card={p.card} size="sm" />
        ))}
      </div>
    </div>
  );
}
