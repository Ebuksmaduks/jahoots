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
// ── Audio file paths — drop your own files in public/audio/ to replace ───────
const MUSIC_TRACKS: Record<Exclude<AudioMode, "silent">, string> = {
  lobby:     "/audio/lobby.mp3",     // chill lobby beat
  game:      "/audio/game.mp3",      // high-energy game music
  countdown: "/audio/countdown.mp3", // tension / countdown music
  results:   "/audio/results.mp3",   // winner anthem
};

const SFX_PATHS = {
  correct: "/audio/correct.mp3",
  wrong:   "/audio/wrong.mp3",
  timeUp:  "/audio/time-up.mp3",
};



// ─── Provider ───────────────────────────────────────────────────────────────
export function AudioProvider({ children }: { children: ReactNode }) {
  const bgRef   = useRef<HTMLAudioElement | null>(null);
  const modeRef = useRef<AudioMode>("silent");
  const [isPlaying, setIsPlaying] = useState(false);
  const isMutedRef = useRef(false);
  
    // ── helpers ────────────────────────────────────────────────────────────────
  const stopBg = useCallback(() => {
    if (!bgRef.current) return;
    bgRef.current.pause();
    bgRef.current.currentTime = 0;

    setIsPlaying(false);
  }, []);
    if (m === "silent" || isMutedRef.current) return;
    stopBg();
    const src = MUSIC_TRACKS[m as Exclude<AudioMode, "silent">];
    const audio = new Audio(src);
    audio.loop   = true;
    audio.volume = 0.45;
    bgRef.current = audio;
    audio.play().then(() => setIsPlaying(true)).catch(() => {
      // Autoplay blocked — will start on first user interaction
      const resume = () => {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
        document.removeEventListener("click",      resume);
        document.removeEventListener("touchstart", resume);
        document.removeEventListener("keydown",    resume);
      };
      document.addEventListener("click",      resume, { once: true });
      document.addEventListener("touchstart", resume, { once: true });
      document.addEventListener("keydown",    resume, { once: true });
    });
  }, [stopBg]);

  // ── public API ─────────────────────────────────────────────────────────────

    
  const setMode = useCallback((newMode: AudioMode) => {
    if (newMode === modeRef.current) return;
    modeRef.current = newMode;
    setModeState(newMode);
    if (newMode === "silent") {
       stopBg();
    } else {
      playBg(newMode);
    }
   }, [stopBg, playBg]);

  const toggleMute = useCallback(() => {
    const next = !isMutedRef.current;
    isMutedRef.current = next;
    setIsMuted(next);
    if (next) {
      stopBg();
    } else if (modeRef.current !== "silent") {
      playBg(modeRef.current);
    }
  }, [stopBg, playBg]);

  const playSfx = useCallback((path: string) => {
    if (isMutedRef.current) return;
    const sfx = new Audio(path);
    sfx.volume = 0.7;
    sfx.play().catch(() => {});
  }, []);
  const playCorrect = useCallback(() => playSfx(SFX_PATHS.correct), [playSfx]);
  const playWrong   = useCallback(() => playSfx(SFX_PATHS.wrong),   [playSfx]);
  const playTimeUp  = useCallback(() => playSfx(SFX_PATHS.timeUp),  [playSfx]);
  // cleanup on unmount

  useEffect(() => {
        return () => { bgRef.current?.pause(); };

  }, []);
  return (
    <AudioCtx.Provider value={{ mode, setMode, isPlaying, toggleMute, isMuted, playCorrect, playWrong, playTimeUp }}>
      {children}
    </AudioCtx.Provider>
  );
}
