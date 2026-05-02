import { useEffect } from "react";
import { useGameStore } from "./store/gameStore";
import { LandingScreen } from "./screens/Landing";
import { MenuScreen } from "./screens/Menu";
import { DeckBuilderScreen } from "./screens/DeckBuilder";
import { MatchScreen } from "./screens/Match";
import { RecapScreen } from "./screens/Recap";
import { LearnMoreScreen } from "./screens/LearnMore";
import { SoundToggle } from "./components/SoundToggle";
import { Credit } from "./components/Credit";
import { installAudioUnlocker } from "./utils/sound";

export default function App() {
  const screen = useGameStore((s) => s.screen);
  useEffect(() => {
    installAudioUnlocker();
  }, []);
  return (
    <>
      <SoundToggle />
      {screen !== "LANDING" && <Credit />}
      {screen === "LANDING" && <LandingScreen />}
      {screen === "MENU" && <MenuScreen />}
      {screen === "DECK_BUILDER" && <DeckBuilderScreen />}
      {screen === "MATCH" && <MatchScreen />}
      {screen === "RECAP" && <RecapScreen />}
      {screen === "LEARN_MORE" && <LearnMoreScreen />}
    </>
  );
}
