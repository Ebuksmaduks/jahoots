import { useEffect, useRef, useState } from "react";

export function useAmapianoMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const schedulerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAll = () => {
    intervalRefs.current.forEach(clearTimeout);
    intervalRefs.current = [];
    if (schedulerRef.current) clearTimeout(schedulerRef.current);
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.3);
    }
    setIsPlaying(false);
  };

  const playNote = (
    ctx: AudioContext,
    dest: AudioNode,
    freq: number,
    time: number,
    duration: number,
    type: OscillatorType = "sine",
    gainVal = 0.15
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(gainVal, time + 0.01);
    gain.gain.setTargetAtTime(0, time + duration * 0.6, duration * 0.2);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + duration + 0.1);
  };

  const playKick = (ctx: AudioContext, dest: AudioNode, time: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(50, time + 0.08);
    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + 0.25);
  };

  const playSnare = (ctx: AudioContext, dest: AudioNode, time: number) => {
    const noise = ctx.createBufferSource();
    const bufSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1500;
    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start(time);
    noise.stop(time + 0.2);
  };

  const playHihat = (ctx: AudioContext, dest: AudioNode, time: number, open = false) => {
    const noise = ctx.createBufferSource();
    const dur = open ? 0.18 : 0.05;
    const bufSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 8000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    noise.start(time);
    noise.stop(time + dur + 0.01);
  };

  // Amapiano log drum - deep woody bass hit
  const playLogDrum = (ctx: AudioContext, dest: AudioNode, time: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.12);
    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(time);
    osc.stop(time + 0.35);
  };

  const startMusic = (ctx: AudioContext) => {
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.4, ctx.currentTime);
    master.connect(ctx.destination);
    masterGainRef.current = master;

    // Amapiano piano chords — F minor pentatonic feel
    // Notes: F3 Ab3 C4 Eb4 F4
    const chords = [
      [174.6, 207.7, 261.6, 311.1], // Fm7
      [174.6, 207.7, 246.9, 293.7], // F add9
      [155.6, 185.0, 233.1, 277.2], // Ebmaj
      [164.8, 196.0, 246.9, 293.7], // Gm
    ];

    const BPM = 112;
    const beat = 60 / BPM;
    const bar = beat * 4;

    let barCount = 0;

    const scheduleBar = () => {
      if (!ctxRef.current) return;
      const t = ctx.currentTime + 0.05;
      const chord = chords[barCount % chords.length];

      // Log drums — Amapiano signature
      [0, 0.5, 1.5, 2, 2.5, 3].forEach((b) => {
        const id = setTimeout(() => playLogDrum(ctx, master, t + b * beat), 0);
        intervalRefs.current.push(id);
      });

      // Kick: beats 1 and 3
      [0, 2].forEach((b) => {
        const id = setTimeout(() => playKick(ctx, master, t + b * beat), 0);
        intervalRefs.current.push(id);
      });

      // Snare: beats 2 and 4
      [1, 3].forEach((b) => {
        const id = setTimeout(() => playSnare(ctx, master, t + b * beat), 0);
        intervalRefs.current.push(id);
      });

      // Hi-hats: 8th notes
      for (let i = 0; i < 8; i++) {
        const open = i === 3 || i === 7;
        const id = setTimeout(() => playHihat(ctx, master, t + i * beat * 0.5, open), 0);
        intervalRefs.current.push(id);
      }

      // Piano chords — Amapiano stabs
      [0, beat * 0.5, beat * 1.5, beat * 2, beat * 3].forEach((offset, idx) => {
        const noteChord = idx % 2 === 0 ? chord : chord.slice(1);
        noteChord.forEach((freq) => {
          const id = setTimeout(
            () => playNote(ctx, master, freq, t + offset, beat * 0.4, "triangle", 0.06),
            0
          );
          intervalRefs.current.push(id);
        });
      });

      // Deep bass line
      const bassNotes = [chord[0] / 2, chord[0] / 2, chord[1] / 2, chord[2] / 2];
      [0, beat, beat * 2, beat * 3].forEach((offset, i) => {
        const id = setTimeout(
          () => playNote(ctx, master, bassNotes[i], t + offset, beat * 0.8, "sawtooth", 0.1),
          0
        );
        intervalRefs.current.push(id);
      });

      barCount++;
      schedulerRef.current = setTimeout(scheduleBar, bar * 1000 - 50);
    };

    scheduleBar();
    setIsPlaying(true);
  };

  const toggle = () => {
    if (isPlaying) {
      stopAll();
    } else {
      if (!ctxRef.current || ctxRef.current.state === "closed") {
        ctxRef.current = new AudioContext();
      }
      if (ctxRef.current.state === "suspended") {
        ctxRef.current.resume();
      }
      startMusic(ctxRef.current);
    }
  };

  // Autoplay on first user interaction
  useEffect(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const tryAutoplay = () => {
      if (ctxRef.current && ctxRef.current.state !== "closed" && !isPlaying) {
        if (ctxRef.current.state === "suspended") {
          ctxRef.current.resume().then(() => startMusic(ctxRef.current!));
        } else {
          startMusic(ctxRef.current);
        }
      }
      document.removeEventListener("click", tryAutoplay);
      document.removeEventListener("touchstart", tryAutoplay);
      document.removeEventListener("keydown", tryAutoplay);
    };

    // Try immediate autoplay
    if (ctx.state === "running") {
      startMusic(ctx);
    } else {
      // Browsers block autoplay; start on first interaction
      document.addEventListener("click", tryAutoplay);
      document.addEventListener("touchstart", tryAutoplay);
      document.addEventListener("keydown", tryAutoplay);
    }

    return () => {
      document.removeEventListener("click", tryAutoplay);
      document.removeEventListener("touchstart", tryAutoplay);
      document.removeEventListener("keydown", tryAutoplay);
      stopAll();
      ctx.close();
    };
  }, []);

  return { isPlaying, toggle };
}
