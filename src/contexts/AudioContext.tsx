import { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from "react";

export type AudioMode = "lobby" | "game" | "countdown" | "results" | "silent";

interface AudioContextValue {
  mode: AudioMode;
  setMode: (mode: AudioMode) => void;
  isPlaying: boolean;
  toggleMute: () => void;
  isMuted: boolean;
  playCorrect: () => void;
  playWrong: () => void;
  playTimeUp: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used inside AudioProvider");
  return ctx;
}

// ─── helpers ───────────────────────────────────────────────────────────────

function getAC(ref: React.MutableRefObject<AudioContext | null>): AudioContext {
  if (!ref.current || ref.current.state === "closed") {
    ref.current = new AudioContext();
  }
  return ref.current;
}

function playOsc(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  time: number,
  dur: number,
  type: OscillatorType = "sine",
  vol = 0.15
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);
  g.gain.setValueAtTime(0, time);
  g.gain.linearRampToValueAtTime(vol, time + 0.01);
  g.gain.setTargetAtTime(0, time + dur * 0.6, dur * 0.25);
  osc.connect(g); g.connect(dest);
  osc.start(time); osc.stop(time + dur + 0.15);
}

function playKick(ctx: AudioContext, dest: AudioNode, time: number, vol = 0.6) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(50, time + 0.08);
  g.gain.setValueAtTime(vol, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
  osc.connect(g); g.connect(dest);
  osc.start(time); osc.stop(time + 0.25);
}

function playSnare(ctx: AudioContext, dest: AudioNode, time: number) {
  const noise = ctx.createBufferSource();
  const bufSize = ctx.sampleRate * 0.15;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  noise.buffer = buf;
  const filt = ctx.createBiquadFilter();
  filt.type = "highpass"; filt.frequency.value = 1500;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.22, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  noise.connect(filt); filt.connect(g); g.connect(dest);
  noise.start(time); noise.stop(time + 0.2);
}

function playHihat(ctx: AudioContext, dest: AudioNode, time: number, open = false) {
  const noise = ctx.createBufferSource();
  const dur = open ? 0.18 : 0.05;
  const bufSize = Math.ceil(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  noise.buffer = buf;
  const filt = ctx.createBiquadFilter();
  filt.type = "highpass"; filt.frequency.value = 8000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.12, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + dur);
  noise.connect(filt); filt.connect(g); g.connect(dest);
  noise.start(time); noise.stop(time + dur + 0.01);
}

function playLogDrum(ctx: AudioContext, dest: AudioNode, time: number) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(220, time);
  osc.frequency.exponentialRampToValueAtTime(80, time + 0.12);
  g.gain.setValueAtTime(0.45, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
  osc.connect(g); g.connect(dest);
  osc.start(time); osc.stop(time + 0.35);
}

// ─── music schedules ────────────────────────────────────────────────────────

const LOBBY_CHORDS = [
  [174.6, 207.7, 261.6, 311.1], // Fm7
  [174.6, 207.7, 246.9, 293.7],
  [155.6, 185.0, 233.1, 277.2], // Ebmaj
  [164.8, 196.0, 246.9, 293.7], // Gm
];

const GAME_CHORDS = [
  [220, 261.6, 329.6, 392],     // Am7 — more tense
  [220, 277.2, 329.6, 415.3],
  [196, 261.6, 311.1, 392],
  [246.9, 293.7, 370, 440],
];

function scheduleLobbyBar(
  ctx: AudioContext,
  master: GainNode,
  barCount: number,
  timers: ReturnType<typeof setTimeout>[]
) {
  const BPM = 112; const beat = 60 / BPM;
  const t = ctx.currentTime + 0.05;
  const chord = LOBBY_CHORDS[barCount % LOBBY_CHORDS.length];

  [0, 0.5, 1.5, 2, 2.5, 3].forEach((b) =>
    timers.push(setTimeout(() => playLogDrum(ctx, master, t + b * beat), 0))
  );
  [0, 2].forEach((b) =>
    timers.push(setTimeout(() => playKick(ctx, master, t + b * beat), 0))
  );
  [1, 3].forEach((b) =>
    timers.push(setTimeout(() => playSnare(ctx, master, t + b * beat), 0))
  );
  for (let i = 0; i < 8; i++) {
    const open = i === 3 || i === 7;
    timers.push(setTimeout(() => playHihat(ctx, master, t + i * beat * 0.5, open), 0));
  }
  [0, beat * 0.5, beat * 1.5, beat * 2, beat * 3].forEach((offset, idx) => {
    const nc = idx % 2 === 0 ? chord : chord.slice(1);
    nc.forEach((freq) =>
      timers.push(setTimeout(() => playOsc(ctx, master, freq, t + offset, beat * 0.4, "triangle", 0.055), 0))
    );
  });
  const bass = [chord[0] / 2, chord[0] / 2, chord[1] / 2, chord[2] / 2];
  [0, beat, beat * 2, beat * 3].forEach((offset, i) =>
    timers.push(setTimeout(() => playOsc(ctx, master, bass[i], t + offset, beat * 0.8, "sawtooth", 0.09), 0))
  );
}

function scheduleGameBar(
  ctx: AudioContext,
  master: GainNode,
  barCount: number,
  timers: ReturnType<typeof setTimeout>[]
) {
  const BPM = 128; const beat = 60 / BPM;
  const t = ctx.currentTime + 0.05;
  const chord = GAME_CHORDS[barCount % GAME_CHORDS.length];

  // Punchier log drums
  [0, 0.375, 1, 1.5, 2, 2.5, 3, 3.5].forEach((b) =>
    timers.push(setTimeout(() => playLogDrum(ctx, master, t + b * beat), 0))
  );
  [0, 2].forEach((b) =>
    timers.push(setTimeout(() => playKick(ctx, master, t + b * beat, 0.7), 0))
  );
  [1, 3].forEach((b) =>
    timers.push(setTimeout(() => playSnare(ctx, master, t + b * beat), 0))
  );
  for (let i = 0; i < 16; i++) {
    const open = i === 7 || i === 15;
    timers.push(setTimeout(() => playHihat(ctx, master, t + i * beat * 0.25, open), 0));
  }
  // Staccato stabs — more urgent
  [0, beat * 0.25, beat * 1, beat * 2, beat * 2.5].forEach((offset) => {
    chord.slice(0, 3).forEach((freq) =>
      timers.push(setTimeout(() => playOsc(ctx, master, freq, t + offset, beat * 0.2, "sawtooth", 0.04), 0))
    );
  });
  const bass = [chord[0] / 2, chord[2] / 2, chord[1] / 2, chord[3] / 2];
  [0, beat, beat * 2, beat * 3].forEach((offset, i) =>
    timers.push(setTimeout(() => playOsc(ctx, master, bass[i], t + offset, beat * 0.7, "sawtooth", 0.1), 0))
  );
}

function scheduleCountdownBar(
  ctx: AudioContext,
  master: GainNode,
  barCount: number,
  timers: ReturnType<typeof setTimeout>[]
) {
  // High-tension: fast BPM, escalating pitch, no melodics
  const BPM = 160; const beat = 60 / BPM;
  const t = ctx.currentTime + 0.05;
  const tension = 0.35 + barCount * 0.07; // escalates

  for (let i = 0; i < 4; i++) {
    timers.push(setTimeout(() => playKick(ctx, master, t + i * beat, Math.min(tension, 0.8)), 0));
    timers.push(setTimeout(() => playSnare(ctx, master, t + (i + 0.5) * beat), 0));
  }
  for (let i = 0; i < 8; i++) {
    timers.push(setTimeout(() => playHihat(ctx, master, t + i * beat * 0.5, i % 2 === 1), 0));
  }
  // Rising tension drone
  const droneFreq = 110 * Math.pow(2, Math.min(barCount, 6) / 12);
  timers.push(setTimeout(() => playOsc(ctx, master, droneFreq, t, beat * 4, "sawtooth", 0.07), 0));
  timers.push(setTimeout(() => playOsc(ctx, master, droneFreq * 1.5, t, beat * 4, "square", 0.03), 0));
}

function scheduleResultsBar(
  ctx: AudioContext,
  master: GainNode,
  barCount: number,
  timers: ReturnType<typeof setTimeout>[]
) {
  // Celebratory — major key, bright
  const BPM = 100; const beat = 60 / BPM;
  const t = ctx.currentTime + 0.05;
  const ANTHEM = [
    [261.6, 329.6, 392, 523.3],   // C major
    [293.7, 369.9, 440, 587.3],   // D minor
    [349.2, 440, 523.3, 659.3],   // F major
    [392, 493.9, 587.3, 783.9],   // G major
  ];
  const chord = ANTHEM[barCount % ANTHEM.length];

  [0, 2].forEach((b) =>
    timers.push(setTimeout(() => playKick(ctx, master, t + b * beat, 0.6), 0))
  );
  [1, 3].forEach((b) =>
    timers.push(setTimeout(() => playSnare(ctx, master, t + b * beat), 0))
  );
  [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].forEach((b) =>
    timers.push(setTimeout(() => playHihat(ctx, master, t + b * beat, b % 1 === 0.5), 0))
  );
  // Full bright chord stabs
  [0, beat * 0.5, beat * 2, beat * 2.5].forEach((offset) => {
    chord.forEach((freq) =>
      timers.push(setTimeout(() => playOsc(ctx, master, freq, t + offset, beat * 0.5, "triangle", 0.07), 0))
    );
  });
  // Walking bass
  const bass = [chord[0] / 2, chord[1] / 2, chord[2] / 2, chord[3] / 2];
  [0, beat, beat * 2, beat * 3].forEach((offset, i) =>
    timers.push(setTimeout(() => playOsc(ctx, master, bass[i], t + offset, beat * 0.9, "sawtooth", 0.11), 0))
  );
  // Log drum groove
  [0, 0.5, 1.5, 2, 3].forEach((b) =>
    timers.push(setTimeout(() => playLogDrum(ctx, master, t + b * beat), 0))
  );
}

// ─── SFX ────────────────────────────────────────────────────────────────────

function sfxCorrect(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.5, ctx.currentTime);
  master.connect(ctx.destination);
  const t = ctx.currentTime;
  // Rising arpeggio: C E G C
  [[523.3, 0], [659.3, 0.08], [784, 0.16], [1046.5, 0.24]].forEach(([freq, delay]) => {
    playOsc(ctx, master, freq, t + delay, 0.3, "triangle", 0.4);
  });
  // Bright shimmer
  playOsc(ctx, master, 2093, t + 0.24, 0.4, "sine", 0.15);
}

function sfxWrong(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.5, ctx.currentTime);
  master.connect(ctx.destination);
  const t = ctx.currentTime;
  // Descending: buzzer
  playOsc(ctx, master, 220, t, 0.15, "sawtooth", 0.4);
  playOsc(ctx, master, 180, t + 0.15, 0.15, "sawtooth", 0.35);
  playOsc(ctx, master, 140, t + 0.3, 0.2, "sawtooth", 0.3);
}

function sfxTimeUp(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.5, ctx.currentTime);
  master.connect(ctx.destination);
  const t = ctx.currentTime;
  // Alarm-style: 3 quick descending beeps
  [0, 0.18, 0.36].forEach((delay, i) => {
    playOsc(ctx, master, 880 - i * 110, t + delay, 0.14, "square", 0.3);
  });
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function AudioProvider({ children }: { children: ReactNode }) {
  const acRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const schedulerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barCountRef = useRef(0);
  const modeRef = useRef<AudioMode>("silent");

  const [mode, setModeState] = useState<AudioMode>("silent");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const unlockedRef = useRef(false);

  const stopScheduler = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (schedulerRef.current) clearTimeout(schedulerRef.current);
    schedulerRef.current = null;
    if (masterRef.current && acRef.current) {
      masterRef.current.gain.setTargetAtTime(0, acRef.current.currentTime, 0.3);
    }
    setIsPlaying(false);
  }, []);

  const startScheduler = useCallback((m: AudioMode) => {
    if (m === "silent" || isMutedRef.current) return;
    stopScheduler();

    const ctx = getAC(acRef);
    if (ctx.state === "suspended") return; // wait for unlock

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.5);
    master.connect(ctx.destination);
    masterRef.current = master;
    barCountRef.current = 0;

    const BPM_MAP: Record<AudioMode, number> = {
      lobby: 112, game: 128, countdown: 160, results: 100, silent: 112,
    };
    const bpm = BPM_MAP[m];
    const barMs = (60 / bpm) * 4 * 1000;

    const tick = () => {
      if (!acRef.current || isMutedRef.current) return;
      const tms = timersRef.current;
      if (m === "lobby") scheduleLobbyBar(ctx, master, barCountRef.current, tms);
      else if (m === "game") scheduleGameBar(ctx, master, barCountRef.current, tms);
      else if (m === "countdown") scheduleCountdownBar(ctx, master, barCountRef.current, tms);
      else if (m === "results") scheduleResultsBar(ctx, master, barCountRef.current, tms);
      barCountRef.current++;
      schedulerRef.current = setTimeout(tick, barMs - 50);
    };

    tick();
    setIsPlaying(true);
  }, [stopScheduler]);

  const setMode = useCallback((newMode: AudioMode) => {
    if (newMode === modeRef.current) return;
    modeRef.current = newMode;
    setModeState(newMode);
    if (newMode === "silent") {
      stopScheduler();
    } else if (unlockedRef.current && !isMutedRef.current) {
      startScheduler(newMode);
    }
  }, [stopScheduler, startScheduler]);

  const toggleMute = useCallback(() => {
    const next = !isMutedRef.current;
    isMutedRef.current = next;
    setIsMuted(next);
    if (next) {
      stopScheduler();
    } else if (unlockedRef.current && modeRef.current !== "silent") {
      startScheduler(modeRef.current);
    }
  }, [stopScheduler, startScheduler]);

  const unlock = useCallback(() => {
    if (unlockedRef.current) return;
    const ctx = getAC(acRef);
    const resume = () => {
      ctx.resume().then(() => {
        unlockedRef.current = true;
        document.removeEventListener("click", resume);
        document.removeEventListener("touchstart", resume);
        document.removeEventListener("keydown", resume);
        if (!isMutedRef.current && modeRef.current !== "silent") {
          startScheduler(modeRef.current);
        }
      });
    };
    if (ctx.state === "running") {
      unlockedRef.current = true;
      if (!isMutedRef.current && modeRef.current !== "silent") {
        startScheduler(modeRef.current);
      }
    } else {
      document.addEventListener("click", resume);
      document.addEventListener("touchstart", resume);
      document.addEventListener("keydown", resume);
    }
  }, [startScheduler]);

  useEffect(() => {
    unlock();
    return () => {
      stopScheduler();
      acRef.current?.close();
    };
  }, []);

  const playCorrect = useCallback(() => {
    if (isMutedRef.current) return;
    const ctx = getAC(acRef);
    if (ctx.state === "running") sfxCorrect(ctx);
  }, []);

  const playWrong = useCallback(() => {
    if (isMutedRef.current) return;
    const ctx = getAC(acRef);
    if (ctx.state === "running") sfxWrong(ctx);
  }, []);

  const playTimeUp = useCallback(() => {
    if (isMutedRef.current) return;
    const ctx = getAC(acRef);
    if (ctx.state === "running") sfxTimeUp(ctx);
  }, []);

  return (
    <AudioCtx.Provider value={{ mode, setMode, isPlaying, toggleMute, isMuted, playCorrect, playWrong, playTimeUp }}>
      {children}
    </AudioCtx.Provider>
  );
}
