import type { Card } from "../engine/types";
import { CardView } from "./CardView";
import { simpleDefFor } from "../engine/card-simple";

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
        const def = simpleDefFor(card.id);
        return (
          <div key={card.id} className="snap-start shrink-0 flex flex-col gap-1 w-32">
            <CardView
              card={card}
              selected={selected}
              disabled={disabled}
              onClick={() => onCardClick(card.id)}
              size="md"
            />
            {def && (
              <div
                className="text-[9px] leading-tight text-center opacity-75 px-1"
                title={def}
              >
                {def}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
