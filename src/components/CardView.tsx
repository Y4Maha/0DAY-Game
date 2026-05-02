import { motion } from "framer-motion";
import type { Card } from "../engine/types";

interface Props {
  card: Card;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export function CardView({ card, selected, disabled, onClick, size = "md" }: Props) {
  const dims =
    size === "sm" ? "w-20 h-28" : size === "lg" ? "w-48 h-72" : "w-32 h-48";

  const factionBg =
    card.faction === "ATTACKER"
      ? "bg-gradient-to-br from-rose-900 to-red-700 border-rose-500"
      : "bg-gradient-to-br from-cyan-900 to-blue-700 border-cyan-500";

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative ${dims} rounded-lg border-2 ${factionBg} ${
        selected ? "ring-2 ring-accent" : ""
      } ${disabled ? "opacity-40" : ""} shadow-lg flex flex-col text-left p-2`}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-white">{card.energy}</span>
        <span className="text-[10px] uppercase tracking-wider opacity-70">
          {card.faction}
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img
          src={card.art}
          alt={card.name}
          className="w-full h-full object-contain max-h-20"
          onError={(e) => ((e.currentTarget.style.display = "none"))}
        />
      </div>
      <div className="font-display text-[10px] uppercase font-bold leading-tight">
        {card.name}
      </div>
      {size === "lg" && (
        <div className="text-[9px] mt-1 opacity-80 leading-tight italic">
          {card.flavor}
        </div>
      )}
    </motion.button>
  );
}
