import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAudio } from "@/contexts/AudioContext";
import { supabase } from "@/integrations/supabase/client";
import Confetti from "@/components/Confetti";
import { Button } from "@/components/ui/button";

interface Player {
  id: string;
  name: string;
  score: number;
}

export default function PlayerResults() {
  const { gameId, playerId } = useParams<{ gameId: string; playerId: string }>();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [myRank, setMyRank] = useState(0);
  const [myScore, setMyScore] = useState(0);

  useEffect(() => {
    if (!gameId || !playerId) return;
    supabase
      .from("players")
      .select("id, name, score")
      .eq("game_id", gameId)
      .order("score", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setPlayers(data);
          const rank = data.findIndex((p) => p.id === playerId);
          setMyRank(rank + 1);
          setMyScore(data[rank]?.score ?? 0);
        }
      });
  }, [gameId, playerId]);

  const podiumEmojis = ["🥇", "🥈", "🥉"];
  const rankMessages = [
    "You be the champion! 🏆",
    "Sharp-sharp! Almost there! 🥈",
    "E still good! You try! 🥉",
  ];

  return (
    <div className="min-h-screen bg-naija flex flex-col items-center justify-center px-4 py-8">
      {myRank <= 3 && <Confetti />}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center mb-6 animate-bounce-in">
          <div className="text-6xl mb-3">
            {myRank === 1 ? "🏆" : myRank === 2 ? "🥈" : myRank === 3 ? "🥉" : "🎮"}
          </div>
          <h2 className="text-2xl font-black mb-1" style={{ color: "#008753" }}>
            {myRank <= 3 ? rankMessages[myRank - 1] : "Good game! Keep trying!"}
          </h2>
          <p className="text-muted-foreground mb-4">Your rank: #{myRank}</p>
          <div className="bg-primary/10 rounded-2xl p-4">
            <p className="text-4xl font-black" style={{ color: "#008753" }}>{myScore}</p>
            <p className="text-muted-foreground text-sm font-medium">Total Points</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <h3 className="text-lg font-black mb-3" style={{ color: "#008753" }}>
            Final Standings 📊
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {players.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  p.id === playerId ? "ring-2 ring-primary bg-primary/10" : i % 2 === 0 ? "bg-gray-50" : ""
                }`}
              >
                <span className="font-black text-base w-7 text-center">
                  {i < 3 ? podiumEmojis[i] : `${i + 1}`}
                </span>
                <span className="flex-1 font-bold truncate">
                  {p.name} {p.id === playerId && "(You)"}
                </span>
                <span className="font-black" style={{ color: "#008753" }}>{p.score} pts</span>
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
