import { useGameStore } from "../store/gameStore";
import { CARDS_BY_FACTION } from "../engine/cards";
import { CardView } from "../components/CardView";
import { Logo8Bit } from "../components/Logo8Bit";
import { simpleDefFor } from "../engine/card-simple";
import { sfx } from "../utils/sound";

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

  const onToggle = (cardId: string) => {
    const isSelected = selected.includes(cardId);
    const atLimit = !isSelected && selected.length >= 8;
    if (atLimit) return;
    if (isSelected) sfx.cardCancel();
    else sfx.cardPick();
    toggle(cardId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-20 bg-bg/95 backdrop-blur px-4 py-3 flex justify-between items-center gap-3 flex-wrap border-b border-white/5">
        <button onClick={() => setScreen("MENU")} className="text-sm opacity-70">
          ◀ Back
        </button>
        <Logo8Bit scale={0.55} />
        <div className="font-display uppercase text-sm">
          Pick {selected.length}/8
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 px-4 pt-4 pb-28">
        <div className="text-center text-sm text-accent font-display tracking-wide">
          Build your deck — pick 8 cards. Tap any card to learn what it means.
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-4 mx-auto">
          {pool.map((card) => {
            const def = simpleDefFor(card.id);
            return (
              <div key={card.id} className="flex flex-col gap-1 w-32">
                <CardView
                  card={card}
                  selected={selected.includes(card.id)}
                  disabled={!selected.includes(card.id) && selected.length >= 8}
                  onClick={() => onToggle(card.id)}
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
      </div>

      <div className="sticky bottom-0 z-20 bg-bg/95 backdrop-blur border-t border-white/5 px-4 py-3">
        <button
          onClick={startMatch}
          disabled={selected.length !== 8}
          className="w-full max-w-sm mx-auto block bg-accent text-bg font-display py-3 px-12 rounded-lg uppercase tracking-wide disabled:opacity-30 hover:bg-accent/80 transition shadow-lg"
        >
          Start Match
        </button>
      </div>
    </div>
  );
}
