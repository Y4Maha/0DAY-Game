import { useGameStore } from "../store/gameStore";
import { Logo8Bit } from "../components/Logo8Bit";

export function MenuScreen() {
  const setFaction = useGameStore((s) => s.setFaction);
  const setScreen = useGameStore((s) => s.setScreen);
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const difficulty = useGameStore((s) => s.difficulty);

  const choose = (f: "ATTACKER" | "DEFENDER") => {
    setFaction(f);
    setScreen("DECK_BUILDER");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      <Logo8Bit className="drop-shadow-[0_0_15px_rgba(167,139,250,0.4)]" />
      <p className="text-center max-w-md opacity-70">
        Real cyberattacks. Real defenses. 3-minute matches.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => choose("ATTACKER")}
          className="bg-rose-700 hover:bg-rose-600 font-display py-3 rounded-lg uppercase"
        >
          Play as Attacker
        </button>
        <button
          onClick={() => choose("DEFENDER")}
          className="bg-cyan-700 hover:bg-cyan-600 font-display py-3 rounded-lg uppercase"
        >
          Play as Defender
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        {(["easy", "medium", "hard"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-3 py-1 rounded text-xs uppercase ${
              difficulty === d ? "bg-accent text-bg" : "bg-white/10"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
