import type { Card } from "../engine/types";
import { CardView } from "./CardView";

interface Props {
  hand: Card[];
  selectedCardIds: string[];
  energyAvailable: number;
  onCardClick: (cardId: string) => void;
}

export function HandView({ hand, selectedCardIds, energyAvailable, onCardClick }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-1">
      {hand.map((card) => {
        const selected = selectedCardIds.includes(card.id);
        const disabled = !selected && card.energy > energyAvailable;
        return (
          <CardView
            key={card.id}
            card={card}
            selected={selected}
            disabled={disabled}
            onClick={() => onCardClick(card.id)}
            size="md"
          />
        );
      })}
    </div>
  );
}
