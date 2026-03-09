import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HostSetup from "./pages/HostSetup";
import HostRoom from "./pages/HostRoom";
import HostGame from "./pages/HostGame";
import JoinGame from "./pages/JoinGame";
import PlayerGame from "./pages/PlayerGame";
import Results from "./pages/Results";
import PlayerResults from "./pages/PlayerResults";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/host" element={<HostSetup />} />
          <Route path="/host/:gameId" element={<HostRoom />} />
          <Route path="/host-game/:gameId" element={<HostGame />} />
          <Route path="/join" element={<JoinGame />} />
          <Route path="/play/:gameId/:playerId" element={<PlayerGame />} />
          <Route path="/results/:gameId" element={<Results />} />
          <Route path="/player-results/:gameId/:playerId" element={<PlayerResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
