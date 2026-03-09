import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JoinGame() {
  const [searchParams] = useSearchParams();
  const prefilledCode = searchParams.get("code")?.toUpperCase() ?? "";
  const [name, setName] = useState("");
  const [code, setCode] = useState(prefilledCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!name.trim()) { setError("Abeg enter your name!"); return; }
    if (code.trim().length !== 6) { setError("Game code must be 6 characters!"); return; }

    setLoading(true);
    setError("");
    try {
      const { data: game, error: gameErr } = await supabase
        .from("games")
        .select("id, status")
        .eq("code", code.toUpperCase().trim())
        .maybeSingle();

      if (gameErr) throw gameErr;
      if (!game) { setError("Game not found! Check the code and try again."); setLoading(false); return; }
      if (game.status === "finished") { setError("This game has already ended!"); setLoading(false); return; }

      const { data: player, error: pErr } = await supabase
        .from("players")
        .insert({ game_id: game.id, name: name.trim() })
        .select()
        .single();

      if (pErr) throw pErr;
      navigate(`/play/${game.id}/${player.id}`);
    } catch (e: any) {
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-naija flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-bounce-in">
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>
        <h2 className="text-2xl font-black text-center mb-1" style={{ color: "#008753" }}>
          Join a Game 📱
        </h2>
        <p className="text-center text-muted-foreground mb-6 text-sm">
          {prefilledCode
            ? `You're joining game ${prefilledCode} — just enter your name! 🎉`
            : "Enter the game code from the host screen"}
        </p>

        <div className="space-y-4">
          <Input
            placeholder="Your display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            className="text-center text-lg font-semibold h-12 border-2 border-primary/30 focus:border-primary"
            maxLength={20}
            autoFocus
          />
          {/* Show code input only if not pre-filled via link */}
          {!prefilledCode && (
            <Input
              placeholder="Game Code (e.g. AB12CD)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              className="text-center text-2xl font-black tracking-widest h-14 border-2 border-primary/30 focus:border-primary uppercase"
              maxLength={6}
            />
          )}
          {prefilledCode && (
            <div className="text-center py-2">
              <span className="bg-primary/10 text-primary font-black text-3xl tracking-[0.2em] px-6 py-3 rounded-2xl border-2 border-primary/30 inline-block">
                {prefilledCode}
              </span>
            </div>
          )}
          {error && (
            <p className="text-destructive text-sm text-center font-medium">{error}</p>
          )}
          <Button
            onClick={handleJoin}
            disabled={loading}
            className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-naija"
          >
            {loading ? "Joining..." : "Join Game! 🔥"}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")} className="w-full">
            ← Back
          </Button>
        </div>
      </div>
    </div>
  );
}
