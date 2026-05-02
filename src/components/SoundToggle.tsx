import { useEffect, useState } from "react";
import { isMuted, setMuted, subscribeMuted } from "../utils/sound";

export function SoundToggle() {
  const [muted, setLocal] = useState(isMuted());

  useEffect(() => subscribeMuted(setLocal), []);

  const toggle = () => setMuted(!muted);

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute sounds" : "Mute sounds"}
      title={muted ? "Sound off — tap to enable" : "Sound on — tap to mute"}
      className="fixed bottom-3 right-3 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-panel/80 border border-white/10 text-base hover:bg-panel hover:border-accent/60 transition shadow-lg"
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
