// Synthesized 8-bit-ish sound effects via Web Audio API. No assets downloaded.
// Browsers require a user gesture before audio can start, so the AudioContext
// is created lazily on the first call.

const STORAGE_KEY = "0day_sound_muted";

let ctx: AudioContext | null = null;
let muted = readMuted();
const listeners = new Set<(m: boolean) => void>();

function readMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeMuted(m: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, m ? "1" : "0");
  } catch {
    // ignore (private mode)
  }
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(m: boolean) {
  muted = m;
  writeMuted(m);
  listeners.forEach((l) => l(m));
}

export function subscribeMuted(fn: (m: boolean) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getCtx(): AudioContext | null {
  if (muted) return null;
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      // iOS WebKit unlock: play a 1-sample silent buffer the first time the
      // context is created. Without this, Web Audio output stays silent on
      // many iOS Safari/WebKit-based browsers (Brave, Chrome, Firefox on iOS)
      // until something else "primes" the audio pipeline.
      try {
        const buf = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
      } catch {
        // ignore; not all browsers need this
      }
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

// Install a one-shot listener that creates+resumes the AudioContext on the
// very first user gesture, even if no sound was requested yet. This guarantees
// the context is in "running" state by the time the first sfx call happens.
let unlockerInstalled = false;
export function installAudioUnlocker() {
  if (unlockerInstalled || typeof window === "undefined") return;
  unlockerInstalled = true;
  const events: (keyof DocumentEventMap)[] = ["pointerdown", "touchstart", "keydown"];
  const handler = () => {
    getCtx();
    events.forEach((e) => document.removeEventListener(e, handler));
  };
  events.forEach((e) =>
    document.addEventListener(e, handler, { once: false, passive: true })
  );
}

interface ToneOpts {
  freq: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  attack?: number;
  glideTo?: number;
  delay?: number;
}

function tone(opts: ToneOpts) {
  const c = getCtx();
  if (!c) return;
  const start = c.currentTime + (opts.delay ?? 0);
  const vol = opts.volume ?? 0.12;
  const attack = opts.attack ?? 0.005;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = opts.type ?? "square";
  osc.frequency.setValueAtTime(opts.freq, start);
  if (opts.glideTo) {
    osc.frequency.exponentialRampToValueAtTime(opts.glideTo, start + opts.duration);
  }
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(vol, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + opts.duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(start);
  osc.stop(start + opts.duration + 0.02);
}

// Public API — tiny library of cues
export const sfx = {
  cardPick() {
    tone({ freq: 880, duration: 0.05, type: "square", volume: 0.08 });
  },
  cardStage() {
    tone({ freq: 520, duration: 0.06, type: "triangle", volume: 0.12 });
    tone({ freq: 780, duration: 0.07, type: "triangle", volume: 0.12, delay: 0.05 });
  },
  cardCancel() {
    tone({ freq: 400, duration: 0.06, type: "square", volume: 0.06 });
  },
  endTurn() {
    tone({ freq: 300, duration: 0.18, type: "sawtooth", volume: 0.1, glideTo: 600 });
  },
  victory() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      tone({ freq: f, duration: 0.22, type: "square", volume: 0.1, delay: i * 0.1 });
    });
  },
  defeat() {
    [392, 311.13, 261.63].forEach((f, i) => {
      tone({ freq: f, duration: 0.32, type: "sawtooth", volume: 0.12, delay: i * 0.18 });
    });
  },
  draw() {
    tone({ freq: 440, duration: 0.4, type: "triangle", volume: 0.1 });
    tone({ freq: 440, duration: 0.4, type: "triangle", volume: 0.1, delay: 0.5 });
  },
};
