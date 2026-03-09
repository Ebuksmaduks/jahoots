import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import Confetti from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/AnimatedBackground";

interface Player {
  id: string;
  name: string;
  score: number;
}

export default function Results() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (!gameId) return;
    supabase
      .from("players")
      .select("id, name, score")
      .eq("game_id", gameId)
      .order("score", { ascending: false })
      .then(({ data }) => { if (data) setPlayers(data); });
  }, [gameId]);

  const podiumEmojis = ["🥇", "🥈", "🥉"];
  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="min-h-screen bg-naija flex flex-col items-center justify-center px-4 py-8">
      <Confetti />
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-4">
          <Logo size="sm" />
        </div>
        <h1 className="text-4xl font-black text-white text-center mb-1">Game Over! 🎉</h1>
        <p className="text-white/70 text-center mb-8">Oya, see who won the game!</p>

        {/* Podium */}
        {top3.length > 0 && (
          <div className="flex items-end justify-center gap-4 mb-6">
            {[top3[1], top3[0], top3[2]].filter(Boolean).map((p, visualI) => {
              const rank = p === top3[0] ? 0 : p === top3[1] ? 1 : 2;
              const heights = ["h-28", "h-20", "h-16"];
              const bgColors = [
                "bg-gold-shine",
                "bg-gray-300",
                "bg-amber-700",
              ];
              return (
                <div key={p.id} className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{podiumEmojis[rank]}</span>
                  <div className="text-white font-black text-sm">{p.name}</div>
                  <div className="text-gold font-black">{p.score} pts</div>
                  <div
                    className={`w-20 ${heights[rank]} ${bgColors[rank]} rounded-t-2xl flex items-center justify-center font-black text-2xl`}
                  >
                    {rank + 1}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full leaderboard */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <h3 className="text-xl font-black mb-4" style={{ color: "#008753" }}>
            Full Leaderboard 📊
          </h3>
          <div className="space-y-2">
            {players.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: i % 2 === 0 ? "#f9f9f9" : "#fff" }}
              >
                <span className="font-black text-lg w-8 text-center">
                  {i < 3 ? podiumEmojis[i] : `${i + 1}`}
                </span>
                <span className="flex-1 font-bold truncate">{p.name}</span>
                <span className="font-black text-lg" style={{ color: "#008753" }}>
                  {p.score} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => navigate("/")}
          className="w-full h-14 text-xl font-black rounded-2xl"
          style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)", color: "#000" }}
        >
          🏠 Play Again!
        </Button>
      </div>
    </div>
  );
}
