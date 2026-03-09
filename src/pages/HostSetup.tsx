import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { generateGameCode } from "@/lib/gameUtils";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/questions";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function HostSetup() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleHost = async () => {
    if (!name.trim()) {
      setError("Abeg enter your name!");
      return;
    }
    if (!category) {
      setError("Please select a category!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const code = generateGameCode();
      const { data, error: dbErr } = await supabase
        .from("games")
        .insert({ code, host_name: name.trim(), status: "waiting", category })
        .select()
        .single();

      if (dbErr) throw dbErr;
      navigate(`/host/${data.id}`);
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
          Host a Game 🎤
        </h2>
        <p className="text-center text-muted-foreground mb-6 text-sm">
          Enter your name and pick a category
        </p>

        <div className="space-y-4">
          <Input
            placeholder="Your name (e.g. Emeka, Funmi...)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleHost()}
            className="text-center text-lg font-semibold h-12 border-2 border-primary/30 focus:border-primary"
            maxLength={20}
          />

          {/* Category Selection */}
          <div>
            <p className="text-sm font-bold text-center mb-3" style={{ color: "#008753" }}>
              Choose a Category 🎯
            </p>
            <div className="grid grid-cols-1 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all font-semibold ${
                    category === cat.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <div>
                    <div className="font-bold text-sm">{cat.label}</div>
                    <div className="text-xs text-muted-foreground font-normal">{cat.description}</div>
                  </div>
                  {category === cat.id && (
                    <span className="ml-auto text-primary text-lg">✅</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center font-medium">{error}</p>
          )}
          <Button
            onClick={handleHost}
            disabled={loading}
            className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-naija"
          >
            {loading ? "Creating..." : "Create Game Room 🚀"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-full"
          >
            ← Back
          </Button>
        </div>
      </div>
    </div>
  );
}
