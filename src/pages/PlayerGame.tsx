import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_QUESTIONS, OPTION_LABELS, OPTION_COLORS, QUESTION_TIME, type Question } from "@/lib/questions";
import { calculatePoints } from "@/lib/gameUtils";
import type { RealtimeChannel } from "@supabase/supabase-js";

type GameStatus = "waiting" | "active" | "finished";

export default function PlayerGame() {
  const { gameId, playerId } = useParams<{ gameId: string; playerId: string }>();
  const navigate = useNavigate();

  const [gameStatus, setGameStatus] = useState<GameStatus>("waiting");
  const [currentQ, setCurrentQ] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<"correct" | "wrong" | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [timeExpired, setTimeExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(10);

  useEffect(() => {
    if (!gameId || !playerId) return;

    supabase.from("players").select("name, score").eq("id", playerId).single().then(({ data }) => {
      if (data) { setPlayerName(data.name); setTotalScore(data.score); }
    });

    supabase.from("games").select("status, current_question_index, question_started_at, category").eq("id", gameId).single().then(({ data }) => {
      if (data) {
        setGameStatus(data.status as GameStatus);
        setCurrentQ(data.current_question_index ?? 0);
        setQuestionStartedAt(data.question_started_at);
        const qs = CATEGORY_QUESTIONS[data.category] ?? CATEGORY_QUESTIONS["nollywood"];
        setQuestions(qs);
        setTotalQuestions(qs.length);
      }
    });

    const channel: RealtimeChannel = supabase
      .channel(`player-game-${gameId}-${playerId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "games", filter: `id=eq.${gameId}` },
        (payload) => {
          const g = payload.new;
          setGameStatus(g.status as GameStatus);
          if (g.status === "finished") {
            navigate(`/player-results/${gameId}/${playerId}`);
            return;
          }
          if (g.current_question_index !== currentQ) {
            setCurrentQ(g.current_question_index);
            setQuestionStartedAt(g.question_started_at);
            setSelectedOption(null);
            setAnswerResult(null);
            setTimeExpired(false);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [gameId, playerId]);

  useEffect(() => {
    if (!gameId || !playerId) return;
    const channel: RealtimeChannel = supabase
      .channel(`player-game-nav-${gameId}-${playerId}-${currentQ}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "games", filter: `id=eq.${gameId}` },
        (payload) => {
          const g = payload.new;
          setGameStatus(g.status as GameStatus);
          if (g.status === "finished") {
            navigate(`/player-results/${gameId}/${playerId}`);
            return;
          }
          if (g.current_question_index !== currentQ) {
            setCurrentQ(g.current_question_index);
            setQuestionStartedAt(g.question_started_at);
            setSelectedOption(null);
            setAnswerResult(null);
            setTimeExpired(false);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [currentQ, gameId, playerId]);

  useEffect(() => {
    if (gameStatus !== "active" || selectedOption !== null || timeExpired) return;
    setTimeLeft(QUESTION_TIME);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQ, gameStatus]);

  const handleAnswer = useCallback(async (optionIndex: number) => {
    if (selectedOption !== null || timeExpired || !gameId || !playerId || questions.length === 0) return;
    setSelectedOption(optionIndex);

    const question = questions[currentQ];
    const isCorrect = optionIndex === question.correct;
    setAnswerResult(isCorrect ? "correct" : "wrong");

    const timeElapsed = questionStartedAt
      ? (Date.now() - new Date(questionStartedAt).getTime()) / 1000
      : QUESTION_TIME;
    const timeRemaining = Math.max(0, QUESTION_TIME - timeElapsed);
    const points = isCorrect ? calculatePoints(timeRemaining, QUESTION_TIME) : 0;

    await supabase.from("player_answers").insert({
      player_id: playerId,
      game_id: gameId,
      question_index: currentQ,
      selected_option: optionIndex,
      is_correct: isCorrect,
      points_earned: points,
    });

    if (isCorrect) {
      const newScore = totalScore + points;
      setTotalScore(newScore);
      await supabase.from("players").update({ score: newScore }).eq("id", playerId);
    }
  }, [selectedOption, timeExpired, gameId, playerId, currentQ, questionStartedAt, totalScore, questions]);

  if (gameStatus === "waiting") {
    return (
      <div className="min-h-screen bg-naija flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4 animate-bounce">⏳</div>
        <h2 className="text-3xl font-black text-white mb-2">Waiting room</h2>
        <p className="text-white/70 text-lg mb-4">Waiting for host to start the game...</p>
        <div className="bg-white/20 rounded-2xl px-6 py-3">
          <span className="text-white font-bold text-lg">You are: </span>
          <span className="text-gold font-black text-xl">{playerName}</span>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];
  if (!question) return null;

  return (
    <div className="min-h-screen bg-naija flex flex-col px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/20 rounded-xl px-3 py-1.5">
          <span className="text-white font-bold text-sm">{playerName}</span>
        </div>
        <div className="text-white/70 text-sm font-medium">
          Q {currentQ + 1}/{totalQuestions}
        </div>
        <div className="bg-white/20 rounded-xl px-3 py-1.5">
          <span className="text-gold font-black">{totalScore} pts</span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl p-5 mb-5 text-center shadow-xl animate-bounce-in">
        <p className="text-muted-foreground text-xs font-medium mb-2">Question {currentQ + 1}</p>
        <h2 className="text-lg font-black leading-tight">{question.question}</h2>
      </div>

      {/* Answer feedback */}
      {answerResult && (
        <div
          className={`rounded-2xl p-4 mb-5 text-center font-black text-2xl animate-bounce-in ${
            answerResult === "correct"
              ? "bg-green-500 text-primary-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {answerResult === "correct" ? "✅ Correct! Oya!" : "❌ Wrong! No wahala!"}
        </div>
      )}

      {timeExpired && !answerResult && (
        <div className="bg-destructive rounded-2xl p-4 mb-5 text-center font-black text-xl text-destructive-foreground animate-bounce-in">
          ⏰ Time up! No points this round.
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 flex-1">
        {question.options.map((opt, i) => {
          const isSelected = selectedOption === i;
          const isCorrect = i === question.correct;
          const showResult = answerResult !== null || timeExpired;

          let extraStyle = "";
          if (showResult && isCorrect) extraStyle = "ring-4 ring-white scale-105";
          if (showResult && isSelected && !isCorrect) extraStyle = "opacity-60";

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedOption !== null || timeExpired}
              className={`${OPTION_COLORS[i]} rounded-2xl p-4 flex items-center gap-3 shadow-lg transition-all active:scale-95 ${extraStyle} ${
                selectedOption === null && !timeExpired ? "hover:scale-[1.02] cursor-pointer" : "cursor-default"
              }`}
            >
              <span className="bg-white/30 rounded-lg w-9 h-9 flex items-center justify-center font-black text-white text-base flex-shrink-0">
                {OPTION_LABELS[i]}
              </span>
              <span className="text-white font-bold text-base text-left">{opt}</span>
            </button>
          );
        })}
      </div>

      {(selectedOption !== null || timeExpired) && (
        <p className="text-white/70 text-center text-sm mt-4">
          Waiting for host to advance... 🎮
        </p>
      )}
    </div>
  );
}
