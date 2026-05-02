import { useGameStore } from "../store/gameStore";
import { EmailCapture } from "../components/EmailCapture";
import { Logo8Bit } from "../components/Logo8Bit";

export function LandingScreen() {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-8 max-w-2xl mx-auto text-center">
      <Logo8Bit scale={1.2} className="drop-shadow-[0_0_20px_rgba(167,139,250,0.5)]" />
      <p className="text-lg leading-relaxed">
        A free card game where every card is a real cyberattack or defense.
        Build a deck. Breach the system. Outsmart the world.
      </p>
      <p className="text-sm opacity-70">
        3-minute matches • Single player vs AI • No signup required
      </p>

      <button
        onClick={() => setScreen("MENU")}
        className="bg-accent text-bg font-display text-2xl px-10 py-4 rounded-xl uppercase tracking-wide hover:bg-accent/80"
      >
        Play Now
      </button>

      <div className="border-t border-white/10 pt-6 mt-4 w-full flex justify-center">
        <EmailCapture />
      </div>

      <div className="text-[10px] opacity-50 max-w-md">
        Built as a demo. No accounts, no ads, no payments. Anonymous analytics only.
        <br />
        © 2026 Y4Maha · all rights reserved
      </div>
    </div>
  );
}
