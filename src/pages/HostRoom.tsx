import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { CATEGORY_QUESTIONS, CATEGORIES } from "@/lib/questions";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { QRCodeSVG } from "qrcode.react";
import AnimatedBackground from "@/components/AnimatedBackground";

interface Player {
  id: string;
  name: string;
}

export default function HostRoom() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameCode, setGameCode] = useState("");
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState("nollywood");

  useEffect(() => {
    if (!gameId) return;

    // Fetch game info
    supabase
      .from("games")
      .select("code, category")
      .eq("id", gameId)
      .single()
      .then(({ data }) => {
        if (data) { setGameCode(data.code); setCategory(data.category ?? "nollywood"); }
      });

    // Fetch existing players
    supabase
      .from("players")
      .select("id, name")
      .eq("game_id", gameId)
      .then(({ data }) => {
        if (data) setPlayers(data);
      });

    // Subscribe to new players
    const channel: RealtimeChannel = supabase
      .channel(`host-room-${gameId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "players", filter: `game_id=eq.${gameId}` },
        (payload) => {
          setPlayers((prev) => {
            if (prev.find((p) => p.id === payload.new.id)) return prev;
            return [...prev, { id: payload.new.id, name: payload.new.name }];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [gameId]);

  const startGame = async () => {
    if (!gameId || players.length === 0) return;
    setStarting(true);
    await supabase
      .from("games")
      .update({ status: "active", current_question_index: 0, question_started_at: new Date().toISOString() })
      .eq("id", gameId);
    navigate(`/host-game/${gameId}`);
  };

  const joinUrl = gameCode
    ? `${window.location.origin}/join?code=${gameCode}`
    : "";

  const copyCode = () => {
    navigator.clipboard.writeText(gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const naija_emojis = ["🎉", "🔥", "💪", "✨", "🇳🇬", "🎵", "🌟"];

  return (
    <div className="min-h-screen bg-naija flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>

        {/* Game Code + QR Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <p className="text-muted-foreground font-semibold text-center mb-4">
            Share this with players to join instantly 🚀
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="p-3 bg-white border-4 border-primary rounded-2xl shadow-md">
                {joinUrl && (
                  <QRCodeSVG
                    value={joinUrl}
                    size={140}
                    fgColor="#008753"
                    bgColor="#ffffff"
                    level="M"
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium">Scan to join</p>
            </div>

            {/* Code + link */}
            <div className="flex-1 text-center sm:text-left w-full">
              <p className="text-xs text-muted-foreground font-semibold mb-1">Game Code</p>
              <div
                className="text-5xl font-black tracking-[0.2em] mb-3 cursor-pointer select-all"
                style={{ color: "#008753" }}
                onClick={copyCode}
              >
                {gameCode}
              </div>

              <p className="text-xs text-muted-foreground font-semibold mb-1">Direct Link</p>
              <div className="bg-primary/5 rounded-xl px-3 py-2 mb-3 border border-primary/20 break-all text-xs font-mono text-primary select-all">
                {joinUrl}
              </div>

              <div className="flex gap-2 justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="border-2 border-primary text-primary font-bold"
                >
                  {copied ? "✅ Copied!" : "📋 Copy Code"}
                </Button>
                <Button
                  size="sm"
                  onClick={copyLink}
                  className="bg-primary text-primary-foreground font-bold"
                >
                  🔗 Copy Link
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Players List */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black" style={{ color: "#008753" }}>
              Players Waiting 👥
            </h3>
            <span className="bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full">
              {players.length} joined
            </span>
          </div>

          {players.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">⏳</div>
              <p className="font-medium">Waiting for players to join...</p>
              <p className="text-sm">Share the code above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {players.map((p, i) => (
                <div
                  key={p.id}
                  className="bg-primary/10 rounded-xl px-3 py-2 text-center font-bold text-primary animate-bounce-in flex items-center gap-2 justify-center"
                >
                  <span>{naija_emojis[i % naija_emojis.length]}</span>
                  <span className="truncate">{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Game Info */}
        <div className="bg-white/10 rounded-2xl p-4 mb-6 text-white text-center">
          <p className="text-sm font-medium opacity-80">
            🎯 {CATEGORY_QUESTIONS[category]?.length ?? 10} questions • ⏱️ 15 seconds each • {CATEGORIES.find(c => c.id === category)?.emoji} {CATEGORIES.find(c => c.id === category)?.label}
          </p>
        </div>

        <Button
          onClick={startGame}
          disabled={players.length === 0 || starting}
          className="w-full h-16 text-2xl font-black rounded-2xl shadow-gold"
          style={{
            background: players.length === 0 ? "#ccc" : "linear-gradient(135deg, #FFD700, #FFA500)",
            color: "#000",
          }}
        >
          {starting ? "Starting..." : players.length === 0 ? "Wait for players to join..." : "🚀 Start Game!"}
        </Button>
      </div>
    </div>
  );
}
