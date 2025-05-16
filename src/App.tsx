
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CandidatePool from "./pages/CandidatePool";
import CandidateProfile from "./pages/CandidateProfile";
import Pipeline from "./pages/Pipeline";
import Analytics from "./pages/Analytics";
import TalentTalk from "./pages/TalentTalk";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/candidates" element={<CandidatePool />} />
          <Route path="/candidates/:id" element={<CandidateProfile />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/talent-talk" element={<TalentTalk />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/new" element={<JobDetail />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
