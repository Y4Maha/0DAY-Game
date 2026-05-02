import { useGameStore } from "./store/gameStore";
import { MenuScreen } from "./screens/Menu";
import { DeckBuilderScreen } from "./screens/DeckBuilder";
import { MatchScreen } from "./screens/Match";

export default function App() {
  const screen = useGameStore((s) => s.screen);
  return (
    <>
      {screen === "LANDING" && <MenuScreen /> /* temp until Task 25 */}
      {screen === "MENU" && <MenuScreen />}
      {screen === "DECK_BUILDER" && <DeckBuilderScreen />}
      {screen === "MATCH" && <MatchScreen />}
      {screen === "RECAP" && <MenuScreen /> /* temp until Task 23 */}
      {screen === "LEARN_MORE" && <MenuScreen /> /* temp until Task 24 */}
    </>
  );
}
