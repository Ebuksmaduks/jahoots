/**
 * BackgroundMusic — Afrobeat-inspired rhythm generated via Web Audio API.
 * Uses no external files; all synthesis is in-browser.
 * Shows a small floating mute/unmute button.
 */
import { useEffect, useRef, useState } from "react";

// ─── Afrobeat pattern helpers ─────────────────────────────────────────────────

const BPM = 102; // Afrobeats groove tempo
const BEAT = 60 / BPM;          // one quarter note in seconds
const STEP = BEAT / 4;           // sixteenth note

// Kick drum: boom on beats 1 & 3
const KICK_PATTERN  = [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0];
// Snare: 2 & 4
const SNARE_PATTERN = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0];
// Hi-hat: every 8th with swing
const HAT_PATTERN   = [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0];
// Shaker: afrobeats rhythm
const SHAKER_PATTERN= [1,0,0,1, 0,1,0,0, 1,0,0,1, 0,1,0,0];
// Bass line notes (MIDI-ish semitones from A2 ~110Hz): roots + 5th
const BASS_LINE     = [0,-1,0,0, 7,-1,0,0, 5,-1,0,0, 3,-1,0,0]; // -1 = rest

function midiToHz(midi: number, base = 55) {
  return base * Math.pow(2, midi / 12);
}

function scheduleKick(ctx: AudioContext, t: number) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(0.001, t + 0.35);
  g.gain.setValueAtTime(0.9, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  o.start(t); o.stop(t + 0.36);
}

function scheduleSnare(ctx: AudioContext, t: number) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  const filt = ctx.createBiquadFilter();
  filt.type = "bandpass"; filt.frequency.value = 2400;
  src.connect(filt); filt.connect(g); g.connect(ctx.destination);
  g.gain.setValueAtTime(0.55, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
  src.start(t); src.stop(t + 0.15);
}

function scheduleHat(ctx: AudioContext, t: number, vol = 0.15) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  const filt = ctx.createBiquadFilter();
  filt.type = "highpass"; filt.frequency.value = 7000;
  src.connect(filt); filt.connect(g); g.connect(ctx.destination);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.055);
  src.start(t); src.stop(t + 0.06);
}

function scheduleShaker(ctx: AudioContext, t: number) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  const filt = ctx.createBiquadFilter();
  filt.type = "highpass"; filt.frequency.value = 5000;
  src.connect(filt); filt.connect(g); g.connect(ctx.destination);
  g.gain.setValueAtTime(0.12, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
  src.start(t); src.stop(t + 0.08);
}

function scheduleBass(ctx: AudioContext, t: number, semitone: number) {
  if (semitone < 0) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "triangle";
  o.frequency.value = midiToHz(semitone);
  o.connect(g); g.connect(ctx.destination);
  g.gain.setValueAtTime(0.4, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + STEP * 3.5);
  o.start(t); o.stop(t + STEP * 3.6);
}

// Marimba-like melody for a Naija afro melody
const MELODY_NOTES = [0, 3, 5, 7, 10, 12, 10, 7]; // pentatonic
const MELODY_BASE  = 220; // A3
function scheduleMelody(ctx: AudioContext, t: number, noteIdx: number) {
  const freq = MELODY_BASE * Math.pow(2, MELODY_NOTES[noteIdx % MELODY_NOTES.length] / 12);
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  const filt = ctx.createBiquadFilter();
  filt.type = "peaking"; filt.frequency.value = 2000; filt.gain.value = 6;
  o.connect(filt); filt.connect(g); g.connect(ctx.destination);
  g.gain.setValueAtTime(0.08, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + STEP * 2);
  o.start(t); o.stop(t + STEP * 2.1);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BackgroundMusic() {
  const [muted, setMuted] = useState(true);      // start muted — user must opt in
  const [started, setStarted] = useState(false);
  const ctxRef  = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef  = useRef(0);
  const melodyStepRef = useRef(0);
  const nextTimeRef = useRef(0);

  const stopAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
    setStarted(false);
    stepRef.current = 0;
  };

  const scheduleAhead = (ctx: AudioContext) => {
    const LOOK_AHEAD = 0.1; // seconds
    const SCHEDULE_INTERVAL = 50; // ms
    const loop = () => {
      while (nextTimeRef.current < ctx.currentTime + LOOK_AHEAD) {
        const t    = nextTimeRef.current;
        const step = stepRef.current;

        if (KICK_PATTERN[step])    scheduleKick(ctx, t);
        if (SNARE_PATTERN[step])   scheduleSnare(ctx, t);
        if (HAT_PATTERN[step])     scheduleHat(ctx, t, step % 8 === 4 ? 0.22 : 0.12);
        if (SHAKER_PATTERN[step])  scheduleShaker(ctx, t);
        scheduleBass(ctx, t, BASS_LINE[step]);
        // Melody every 2 beats (every 8 steps)
        if (step % 8 === 0) scheduleMelody(ctx, t, melodyStepRef.current++);

        nextTimeRef.current += STEP;
        stepRef.current = (step + 1) % 16;
      }
      timerRef.current = setTimeout(loop, SCHEDULE_INTERVAL);
    };
    loop();
  };

  const startMusic = () => {
    stopAll();
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    ctxRef.current = ctx;
    nextTimeRef.current = ctx.currentTime + 0.05;
    stepRef.current = 0;
    melodyStepRef.current = 0;
    scheduleAhead(ctx);
    setStarted(true);
  };

  useEffect(() => {
    if (!muted && !started) startMusic();
    if (muted && started)   stopAll();
  }, [muted]);

  useEffect(() => () => stopAll(), []);

  return (
    <button
      onClick={() => setMuted((m) => !m)}
      title={muted ? "Play background music 🎵" : "Mute music 🔇"}
      className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95"
      style={{
        background: muted
          ? "rgba(0,0,0,0.4)"
          : "linear-gradient(135deg, #FFD700, #FFA500)",
        border: "2px solid rgba(255,255,255,0.3)",
        backdropFilter: "blur(8px)",
        color: muted ? "#fff" : "#000",
      }}
    >
      {muted ? "🔇" : "🎵"}
    </button>
  );
}
