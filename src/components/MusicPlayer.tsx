import { useAmapianoMusic } from "@/hooks/useAmapianoMusic";

export default function MusicPlayer() {
  const { isPlaying, toggle } = useAmapianoMusic();

  return (
    <button
      onClick={toggle}
      title={isPlaying ? "Pause music" : "Play music"}
      className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full shadow-gold flex items-center justify-center text-xl transition-transform hover:scale-110 active:scale-95"
      style={{ background: "linear-gradient(135deg, hsl(51 100% 50%), hsl(40 100% 50%))" }}
    >
      {isPlaying ? "🔊" : "🔇"}
    </button>
  );
}
