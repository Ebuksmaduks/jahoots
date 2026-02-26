
-- Create games table
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  host_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
  current_question_index INTEGER DEFAULT 0,
  question_started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create players table
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create player_answers table
CREATE TABLE public.player_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  selected_option INTEGER,
  is_correct BOOLEAN,
  points_earned INTEGER NOT NULL DEFAULT 0,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(player_id, question_index)
);

-- Enable RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies - public access (no auth required for this game)
CREATE POLICY "Anyone can read games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Anyone can create games" ON public.games FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update games" ON public.games FOR UPDATE USING (true);

CREATE POLICY "Anyone can read players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Anyone can create players" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON public.players FOR UPDATE USING (true);

CREATE POLICY "Anyone can read answers" ON public.player_answers FOR SELECT USING (true);
CREATE POLICY "Anyone can create answers" ON public.player_answers FOR INSERT WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.player_answers;
