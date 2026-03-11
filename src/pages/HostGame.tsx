import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_QUESTIONS, OPTION_LABELS, OPTION_COLORS, CATEGORIES, type Question } from "@/lib/questions";
import Timer from "@/components/Timer";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useAudio } from "@/contexts/AudioContext";

interface Player {
  id: string;
  name: string;
  score: number;
}

export default function HostGame() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [gameCode, setGameCode] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categoryLabel, setCategoryLabel] = useState("");

  useEffect(() => {
    if (!gameId) return;
    supabase.from("games").select("code, category").eq("id", gameId).single().then(({ data }) => {
      if (data) {
        setGameCode(data.code);
        const qs = CATEGORY_QUESTIONS[data.category] ?? CATEGORY_QUESTIONS["nollywood"];
        setQuestions(qs);
        const cat = CATEGORIES.find((c) => c.id === data.category);
        setCategoryLabel(cat ? `${cat.emoji} ${cat.label}` : "");
      }
    });
    fetchPlayers();
  }, [gameId]);

  const question = questions[currentQ];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQ >= totalQuestions - 1;

  const fetchPlayers = useCallback(async () => {
    if (!gameId) return;
    const { data } = await supabase
      .from("players")
      .select("id, name, score")
      .eq("game_id", gameId)
      .order("score", { ascending: false });
    if (data) setPlayers(data);
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;
    setAnsweredCount(0);

    const channel: RealtimeChannel = supabase
      .channel(`host-game-${gameId}-${currentQ}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "player_answers", filter: `game_id=eq.${gameId}` },
        (payload) => {
          if (payload.new.question_index === currentQ) {
            setAnsweredCount((c) => c + 1);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "players", filter: `game_id=eq.${gameId}` },
        () => { fetchPlayers(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [gameId, currentQ, fetchPlayers]);

  const handleTimeUp = useCallback(async () => {
    setTimerRunning(false);
    await fetchPlayers();
    setShowLeaderboard(true);
  }, [fetchPlayers]);

  const handleNext = async () => {
    if (isLastQuestion) {
      await supabase.from("games").update({ status: "finished" }).eq("id", gameId!);
      navigate(`/results/${gameId}`);
    } else {
      const nextQ = currentQ + 1;
      await supabase
        .from("games")
        .update({ current_question_index: nextQ, question_started_at: new Date().toISOString() })
        .eq("id", gameId!);
      setCurrentQ(nextQ);
      setShowLeaderboard(false);
      setTimerRunning(true);
    }
  };

  if (!question) return null;

  if (showLeaderboard) {
    return (
      <div className="min-h-screen bg-naija flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <h2 className="text-4xl font-black text-white text-center mb-2">
            Leaderboard 🏆
          </h2>
          <p className="text-white/70 text-center mb-6">
            Question {currentQ + 1} of {totalQuestions}
          </p>
          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 space-y-3">
            {players.slice(0, 8).map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: i === 0 ? "#FFD70020" : i === 1 ? "#C0C0C020" : i === 2 ? "#CD7F3220" : "#f9f9f9" }}
              >
                <span className="text-2xl font-black w-8 text-center">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                </span>
                <span className="flex-1 font-bold text-lg truncate">{p.name}</span>
                <span className="font-black text-xl" style={{ color: "#008753" }}>
                  {p.score} pts
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={handleNext}
            className="w-full h-16 text-2xl font-black rounded-2xl text-black shadow-gold"
            style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)" }}
          >
            {isLastQuestion ? "🏁 See Final Results!" : "➡️ Next Question"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-naija flex flex-col px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto w-full">
        <div className="bg-white/20 rounded-xl px-4 py-2">
          <span className="text-white font-bold text-sm">Code: </span>
          <span className="text-gold font-black text-lg tracking-widest">{gameCode}</span>
        </div>
        <div className="text-white font-bold text-center">
          <div>Q {currentQ + 1}/{totalQuestions}</div>
          {categoryLabel && <div className="text-xs text-white/70">{categoryLabel}</div>}
        </div>
        <div className="bg-white/20 rounded-xl px-4 py-2 text-white font-bold text-sm">
          {answeredCount}/{players.length} answered
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 w-full text-center animate-bounce-in">
          <p className="text-muted-foreground text-sm font-medium mb-4">Question {currentQ + 1}</p>
          <h2 className="text-2xl sm:text-3xl font-black leading-tight">{question.question}</h2>
        </div>

        {/* Timer */}
        <div className="mb-8">
          <Timer onExpire={handleTimeUp} running={timerRunning} />
        </div>

        {/* Answer options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {question.options.map((opt, i) => (
            <div
              key={i}
              className={`${OPTION_COLORS[i]} rounded-2xl p-5 flex items-center gap-4 shadow-lg`}
            >
              <span className="bg-white/30 rounded-xl w-10 h-10 flex items-center justify-center font-black text-white text-xl flex-shrink-0">
                {OPTION_LABELS[i]}
              </span>
              <span className="text-white font-bold text-lg">{opt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
