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
    <div className="flex gap-2 overflow-x-auto -mx-1 px-1 py-2 snap-x snap-mandatory">
      {hand.map((card) => {
        const selected = selectedCardIds.includes(card.id);
        const disabled = !selected && card.energy > energyAvailable;
        return (
          <div key={card.id} className="snap-start shrink-0">
            <CardView
              card={card}
              selected={selected}
              disabled={disabled}
              onClick={() => onCardClick(card.id)}
              size="md"
            />
          </div>
        );
      })}
    </div>
  );
}
