import { useGameStore } from "./store/gameStore";
import { MatchScreen } from "./screens/Match";

export default function App() {
  const screen = useGameStore((s) => s.screen);
  return (
    <div className="min-h-screen">
      {screen === "MATCH" ? <MatchScreen /> : <DevStartButton />}
    </div>
  );
}

function DevStartButton() {
  const setFaction = useGameStore((s) => s.setFaction);
  const toggleCardSelected = useGameStore((s) => s.toggleCardSelected);
  const startMatch = useGameStore((s) => s.startMatch);
  const startQuickMatch = () => {
    setFaction("ATTACKER");
    [
      "OSINT_SCOUT",
      "PORT_SCANNER",
      "PHISHING_LURE",
      "BRUTE_FORCE_BOT",
      "SQL_INJECTION",
      "STOLEN_CREDENTIALS",
      "SOCIAL_ENGINEER",
      "RANSOMWARE",
    ].forEach(toggleCardSelected);
    startMatch();
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={startQuickMatch}
        className="bg-accent text-bg font-display px-6 py-3 rounded uppercase"
      >
        Start Test Match
      </button>
    </div>
  );
}
