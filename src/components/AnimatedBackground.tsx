/**
 * AnimatedBackground — distinct Nigerian-themed animated backgrounds per page variant.
 * Variants: home | host-setup | host-room | host-game | join | player-waiting | player-game | results
 */

interface Props {
  variant: "home" | "host-setup" | "host-room" | "host-game" | "join" | "player-waiting" | "player-game" | "results";
}

// ─── Home: floating adire-style circles in green/gold/white ──────────────────
const HomeBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Large slow-spinning ring */}
    <div
      className="absolute rounded-full border-[6px] opacity-10"
      style={{
        width: 500, height: 500,
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        borderColor: "#FFD700",
        animation: "spin-slow 30s linear infinite",
      }}
    />
    <div
      className="absolute rounded-full border-[4px] opacity-10"
      style={{
        width: 300, height: 300,
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        borderColor: "#fff",
        animation: "spin-slow 20s linear infinite reverse",
      }}
    />
    {/* Floating blobs */}
    {[
      { x: "5%",  y: "10%", size: 80,  color: "#FFD700", delay: "0s",    dur: "6s"  },
      { x: "85%", y: "8%",  size: 55,  color: "#fff",    delay: "1s",    dur: "7s"  },
      { x: "75%", y: "60%", size: 100, color: "#FFD700", delay: "2s",    dur: "9s"  },
      { x: "10%", y: "70%", size: 70,  color: "#fff",    delay: "0.5s",  dur: "8s"  },
      { x: "50%", y: "85%", size: 60,  color: "#FFD700", delay: "1.5s",  dur: "7.5s"},
      { x: "30%", y: "20%", size: 40,  color: "#fff",    delay: "3s",    dur: "10s" },
      { x: "60%", y: "40%", size: 35,  color: "#FFD700", delay: "0.8s",  dur: "6.5s"},
    ].map((b, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-[0.12]"
        style={{
          width: b.size, height: b.size,
          left: b.x, top: b.y,
          background: b.color,
          animation: `float-blob ${b.dur} ease-in-out infinite alternate`,
          animationDelay: b.delay,
        }}
      />
    ))}
    {/* Naija flag stripes */}
    <div
      className="absolute inset-y-0 opacity-5"
      style={{ left: 0, width: "33.33%", background: "#008753" }}
    />
    <div
      className="absolute inset-y-0 opacity-5"
      style={{ right: 0, width: "33.33%", background: "#008753" }}
    />
  </div>
);

// ─── Host Setup: rising kente-diamond pattern ───────────────────────────────
const HostSetupBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute opacity-[0.07]"
        style={{
          width: 30, height: 30,
          left: `${(i * 11.7) % 100}%`,
          bottom: "-40px",
          background: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#fff" : "#00c96a",
          transform: "rotate(45deg)",
          animation: `rise-diamond 5s ease-in infinite`,
          animationDelay: `${(i * 0.31) % 5}s`,
        }}
      />
    ))}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        background:
          "radial-gradient(ellipse at 20% 80%, hsl(155 100% 18% / 0.8) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, hsl(51 100% 35% / 0.15) 0%, transparent 50%)",
      }}
    />
  </div>
);

// ─── Host Room (lobby): pulsing radar ───────────────────────────────────────
const HostRoomBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[1, 2, 3, 4, 5].map((ring) => (
      <div
        key={ring}
        className="absolute rounded-full border-2 opacity-0"
        style={{
          width:  ring * 180,
          height: ring * 180,
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          borderColor: "#FFD700",
          animation: `radar-pulse 3s ease-out infinite`,
          animationDelay: `${ring * 0.5}s`,
        }}
      />
    ))}
    {/* Corner adire squares */}
    {["0% 0%", "100% 0%", "0% 100%", "100% 100%"].map((pos, i) => (
      <div
        key={i}
        className="absolute opacity-10"
        style={{
          width: 120, height: 120,
          background: "repeating-linear-gradient(45deg, #FFD700 0 4px, transparent 4px 12px)",
          top: pos.split(" ")[1], left: pos.split(" ")[0],
          transform: `translate(${i % 2 === 0 ? "-0%" : "-100%"}, ${i < 2 ? "0%" : "-100%"})`,
        }}
      />
    ))}
  </div>
);

// ─── Host Game (active): electric Naija grid ─────────────────────────────────
const HostGameBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage:
          "linear-gradient(#FFD700 1px, transparent 1px), linear-gradient(90deg, #FFD700 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        animation: "grid-slide 8s linear infinite",
      }}
    />
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-20"
        style={{
          width: 12, height: 12,
          left: `${10 + i * 16}%`,
          top: `${20 + (i % 3) * 25}%`,
          background: "#FFD700",
          animation: `ping-dot 1.5s ease-in-out infinite`,
          animationDelay: `${i * 0.25}s`,
        }}
      />
    ))}
  </div>
);

// ─── Join: warm sunrise burst ────────────────────────────────────────────────
const JoinBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute opacity-20"
      style={{
        width: 600, height: 600,
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        background: "conic-gradient(from 0deg, #FFD700, #FFA500, #008753, #FFD700, #FFA500, #008753, #FFD700)",
        borderRadius: "50%",
        animation: "spin-slow 20s linear infinite",
        filter: "blur(40px)",
      }}
    />
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute opacity-[0.08]"
        style={{
          width: 8, height: `${30 + i * 20}px`,
          left: `${5 + i * 12}%`,
          bottom: 0,
          background: i % 2 === 0 ? "#FFD700" : "#fff",
          borderRadius: "4px 4px 0 0",
          animation: `bar-bounce 1.2s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
  </div>
);

// ─── Player Waiting: bouncing dots / heartbeat ───────────────────────────────
const PlayerWaitingBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(9)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-[0.12]"
        style={{
          width: 60 + (i % 3) * 30,
          height: 60 + (i % 3) * 30,
          left: `${(i * 11) % 90}%`,
          top: `${(i * 17) % 80}%`,
          background: i % 2 === 0 ? "#FFD700" : "#fff",
          animation: `heart-beat 2s ease-in-out infinite`,
          animationDelay: `${i * 0.22}s`,
        }}
      />
    ))}
  </div>
);

// ─── Player Game (active): fast scan-line ────────────────────────────────────
const PlayerGameBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute w-full h-1 opacity-30"
      style={{
        background: "linear-gradient(90deg, transparent, #FFD700, transparent)",
        animation: "scan-line 2s linear infinite",
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, #fff 3px, #fff 4px)",
      }}
    />
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute opacity-[0.06]"
        style={{
          width: 2,
          height: "100%",
          left: `${10 + i * 20}%`,
          background: "linear-gradient(to bottom, transparent, #FFD700, transparent)",
          animation: `vert-scan 3s ease-in-out infinite`,
          animationDelay: `${i * 0.6}s`,
        }}
      />
    ))}
  </div>
);

// ─── Results: celebration fireworks ─────────────────────────────────────────
const ResultsBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(24)].map((_, i) => {
      const colors = ["#FFD700", "#FFA500", "#fff", "#00c96a", "#FF6B6B", "#4ECDC4"];
      return (
        <div
          key={i}
          className="absolute rounded-full opacity-0"
          style={{
            width: 8 + (i % 5) * 4,
            height: 8 + (i % 5) * 4,
            left: `${(i * 4.2) % 100}%`,
            top: `${(i * 7.3) % 60}%`,
            background: colors[i % colors.length],
            animation: `firework-pop 2.5s ease-out infinite`,
            animationDelay: `${(i * 0.11) % 2.5}s`,
          }}
        />
      );
    })}
    {/* Rainbow arc at top */}
    <div
      className="absolute opacity-10"
      style={{
        width: 800, height: 400,
        top: -200, left: "50%",
        transform: "translateX(-50%)",
        background: "conic-gradient(from 180deg at 50% 100%, #FF0000, #FF7700, #FFD700, #00c96a, #0088FF, #8800FF, #FF0000)",
        borderRadius: "50% 50% 0 0",
        filter: "blur(20px)",
      }}
    />
  </div>
);

// ─── Main export ─────────────────────────────────────────────────────────────
export default function AnimatedBackground({ variant }: Props) {
  const map: Record<Props["variant"], JSX.Element> = {
    "home":           <HomeBackground />,
    "host-setup":     <HostSetupBackground />,
    "host-room":      <HostRoomBackground />,
    "host-game":      <HostGameBackground />,
    "join":           <JoinBackground />,
    "player-waiting": <PlayerWaitingBackground />,
    "player-game":    <PlayerGameBackground />,
    "results":        <ResultsBackground />,
  };
  return map[variant] ?? null;
}
