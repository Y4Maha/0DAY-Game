interface Props {
  current: number;
  max: number;
  turn: number;
  totalTurns: number;
}

export function EnergyBar({ current, max, turn, totalTurns }: Props) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="flex flex-col items-center leading-tight">
        <span className="text-[9px] uppercase tracking-widest opacity-60">Turn</span>
        <span className="font-display font-bold text-base sm:text-lg">
          {turn}
          <span className="opacity-50 text-xs">/{totalTurns}</span>
        </span>
      </div>

      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/40"
        title="Energy left to play cards this turn"
      >
        <span className="text-[9px] uppercase tracking-widest text-accent font-bold">
          ⚡ Energy
        </span>
        <div className="flex gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < current ? "bg-accent shadow-[0_0_6px_rgba(167,139,250,0.8)]" : "bg-white/15"
              }`}
            />
          ))}
        </div>
        <span className="font-display font-bold text-base sm:text-lg text-accent">
          {current}
          <span className="opacity-50 text-xs">/{max}</span>
        </span>
      </div>
    </div>
  );
}
