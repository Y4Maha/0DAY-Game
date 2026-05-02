import { create } from "zustand";
import type { Faction, MatchState } from "../engine/types";
import { initMatch, playCards, advanceTurn } from "../engine/match";
import type { PlayIntent } from "../engine/match";
import { CARDS_BY_FACTION } from "../engine/cards";
import { chooseAIPlays } from "../engine/ai";
import type { AIDifficulty } from "../engine/ai";
import { selectRecapLesson } from "../engine/recap";
import type { RecapLesson } from "../engine/recap";

export type Screen = "LANDING" | "MENU" | "DECK_BUILDER" | "MATCH" | "RECAP" | "LEARN_MORE";

interface GameState {
  screen: Screen;
  faction: Faction | null;
  selectedCards: string[];
  difficulty: AIDifficulty;
  match: MatchState | null;
  pendingPlays: PlayIntent[];
  recap: RecapLesson | null;
  learnMoreCardId: string | null;
  matchCount: number;

  setScreen: (s: Screen) => void;
  setFaction: (f: Faction) => void;
  toggleCardSelected: (id: string) => void;
  setDifficulty: (d: AIDifficulty) => void;
  startMatch: () => void;
  stagePlay: (intent: PlayIntent) => void;
  unstagePlay: (cardId: string) => void;
  resolveTurn: () => void;
  openLearnMore: (cardId: string) => void;
  closeLearnMore: () => void;
  resetForNextMatch: () => void;
}

function readMatchCount(): number {
  if (typeof localStorage === "undefined") return 0;
  return Number(localStorage.getItem("0day_match_count") ?? 0);
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: "LANDING",
  faction: null,
  selectedCards: [],
  difficulty: "medium",
  match: null,
  pendingPlays: [],
  recap: null,
  learnMoreCardId: null,
  matchCount: readMatchCount(),

  setScreen: (s) => set({ screen: s }),
  setFaction: (f) => set({ faction: f, selectedCards: [] }),
  toggleCardSelected: (id) =>
    set((state) => {
      if (state.selectedCards.includes(id)) {
        return { selectedCards: state.selectedCards.filter((x) => x !== id) };
      }
      if (state.selectedCards.length >= 8) return state;
      return { selectedCards: [...state.selectedCards, id] };
    }),
  setDifficulty: (d) => set({ difficulty: d }),

  startMatch: () => {
    const { faction, selectedCards } = get();
    if (!faction || selectedCards.length !== 8) return;
    const allCards = [...CARDS_BY_FACTION.ATTACKER, ...CARDS_BY_FACTION.DEFENDER];
    const p1Deck = selectedCards.map((id) => allCards.find((c) => c.id === id)!).filter(Boolean);
    const p2Faction: Faction = faction === "ATTACKER" ? "DEFENDER" : "ATTACKER";
    const p2Deck = CARDS_BY_FACTION[p2Faction].slice(0, 8);
    const m = initMatch({ p1Faction: faction, p1Deck, p2Faction, p2Deck });
    set({ match: m, pendingPlays: [], screen: "MATCH" });
  },

  stagePlay: (intent) =>
    set((state) => {
      if (!state.match) return state;
      const card = state.match.p1.hand.find((c) => c.id === intent.cardId);
      if (!card) return state;
      const energyUsed = state.pendingPlays.reduce((s, p) => {
        const c = state.match!.p1.hand.find((x) => x.id === p.cardId);
        return s + (c?.energy ?? 0);
      }, 0);
      if (energyUsed + card.energy > state.match.p1.energy) return state;
      return { pendingPlays: [...state.pendingPlays, intent] };
    }),

  unstagePlay: (cardId) =>
    set((state) => ({
      pendingPlays: state.pendingPlays.filter((p) => p.cardId !== cardId),
    })),

  resolveTurn: () => {
    const { match, pendingPlays, difficulty } = get();
    if (!match) return;
    const aiPlays = chooseAIPlays(match, "P2", difficulty);
    let next = playCards(match, pendingPlays, aiPlays);
    next = advanceTurn(next);
    if (next.phase === "END") {
      const recap = selectRecapLesson(next, "P1");
      const newCount = get().matchCount + 1;
      try {
        localStorage.setItem("0day_match_count", String(newCount));
      } catch {
        // ignore (private mode, etc.)
      }
      set({ match: next, pendingPlays: [], recap, screen: "RECAP", matchCount: newCount });
    } else {
      set({ match: next, pendingPlays: [] });
    }
  },

  openLearnMore: (cardId) => set({ learnMoreCardId: cardId, screen: "LEARN_MORE" }),
  closeLearnMore: () => set({ screen: "RECAP", learnMoreCardId: null }),

  resetForNextMatch: () =>
    set({
      match: null,
      pendingPlays: [],
      recap: null,
      learnMoreCardId: null,
      screen: "MENU",
      selectedCards: [],
      faction: null,
    }),
}));
