import { useGameStore } from "../store/gameStore";
import { CARDS_BY_FACTION } from "../engine/cards";
import { CardView } from "../components/CardView";

export function DeckBuilderScreen() {
  const faction = useGameStore((s) => s.faction);
  const selected = useGameStore((s) => s.selectedCards);
  const toggle = useGameStore((s) => s.toggleCardSelected);
  const startMatch = useGameStore((s) => s.startMatch);
  const setScreen = useGameStore((s) => s.setScreen);

  if (!faction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => setScreen("MENU")}
          className="text-sm opacity-70 underline"
        >
          ◀ No faction selected — back to menu
        </button>
      </div>
    );
  }

  const pool = CARDS_BY_FACTION[faction];

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4">
      <div className="flex justify-between items-center">
        <button onClick={() => setScreen("MENU")} className="text-sm opacity-70">
          ◀ Back
        </button>
        <div className="font-display uppercase text-sm">
          Pick {selected.length}/8
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mx-auto">
        {pool.map((card) => (
          <CardView
            key={card.id}
            card={card}
            selected={selected.includes(card.id)}
            disabled={!selected.includes(card.id) && selected.length >= 8}
            onClick={() => toggle(card.id)}
          />
        ))}
      </div>

      <button
        onClick={startMatch}
        disabled={selected.length !== 8}
        className="bg-accent text-bg font-display py-3 rounded-lg uppercase tracking-wide disabled:opacity-30"
      >
        Start Match
      </button>
    </div>
  );
}
