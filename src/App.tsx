import { useGameStore } from "./store/gameStore";
import { LandingScreen } from "./screens/Landing";
import { MenuScreen } from "./screens/Menu";
import { DeckBuilderScreen } from "./screens/DeckBuilder";
import { MatchScreen } from "./screens/Match";
import { RecapScreen } from "./screens/Recap";
import { LearnMoreScreen } from "./screens/LearnMore";

export default function App() {
  const screen = useGameStore((s) => s.screen);
  return (
    <>
      {screen === "LANDING" && <LandingScreen />}
      {screen === "MENU" && <MenuScreen />}
      {screen === "DECK_BUILDER" && <DeckBuilderScreen />}
      {screen === "MATCH" && <MatchScreen />}
      {screen === "RECAP" && <RecapScreen />}
      {screen === "LEARN_MORE" && <LearnMoreScreen />}
    </>
  );
}
