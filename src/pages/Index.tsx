import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const NigerianPatternBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-10"
        style={{
          width: `${60 + Math.random() * 100}px`,
          height: `${60 + Math.random() * 100}px`,
          left: `${(i * 8.3) % 100}%`,
          top: `${(i * 13.7) % 100}%`,
          background: i % 2 === 0 ? "#FFD700" : "#fff",
        }}
      />
    ))}
  </div>
);

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-naija relative flex flex-col overflow-hidden">
      <NigerianPatternBg />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-center py-8 px-4">
        <Logo size="lg" />
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
        <div className="animate-bounce-in">
          <p className="text-white/80 text-lg sm:text-xl font-semibold mb-2">
            🇳🇬 The Naija Trivia Experience 🎮
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
            Oya, test your{" "}
            <span className="text-gold">Naija knowledge!</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-lg mx-auto mb-10">
            Compete with your friends in real-time Nollywood, music, culture trivia. Who sabi pass? 🔥
          </p>

          {/* Main CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button
              onClick={() => navigate("/host")}
              size="lg"
              className="h-16 px-10 text-xl font-black rounded-2xl shadow-gold transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FFA500)",
                color: "#000",
              }}
            >
              🎤 Host Game
            </Button>
            <Button
              onClick={() => navigate("/join")}
              size="lg"
              className="h-16 px-10 text-xl font-black rounded-2xl bg-white text-primary hover:bg-white/90 shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              📱 Join Game
            </Button>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center max-w-lg">
          {[
            "🎵 Music Trivia",
            "🎬 Nollywood",
            "🗣️ Pidgin",
            "🏙️ Nigerian Cities",
            "⚽ Football",
          ].map((tag) => (
            <span
              key={tag}
              className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full border border-white/30"
            >
              {tag}
            </span>
          ))}
        </div>
      </main>

      {/* How it works */}
      <section className="relative z-10 px-4 pb-12 max-w-3xl mx-auto w-full">
        <h2 className="text-white font-black text-2xl text-center mb-6">How e work? 🤔</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🎤", step: "1", title: "Host creates game", desc: "Get a 6-character code to share" },
            { icon: "📱", step: "2", title: "Players join", desc: "Enter code on your phone" },
            { icon: "🏆", step: "3", title: "Compete!", desc: "Answer fast, score high!" },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="bg-gold-shine text-black text-xs font-black px-2 py-0.5 rounded-full inline-block mb-2">
                Step {item.step}
              </div>
              <h3 className="text-white font-black mb-1">{item.title}</h3>
              <p className="text-white/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-6">
        <p className="text-white/40 text-sm">Made with ❤️ for Naija 🇳🇬</p>
      </footer>
    </div>
  );
}
