interface Props {
  current: number;
  max: number;
  turn: number;
  totalTurns: number;
}

export function EnergyBar({ current, max, turn, totalTurns }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-xs uppercase opacity-70">
        Turn {turn}/{totalTurns}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i < current ? "bg-accent" : "bg-white/10"}`}
          />
        ))}
      </div>
      <div className="text-xs font-mono">
        {current}/{max}
      </div>
    </div>
  );
}
