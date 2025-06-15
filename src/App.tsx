
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SortingVisualizer from "./pages/SortingVisualizer";
import GraphVisualizer from "./pages/GraphVisualizer";
import DPVisualizer from "./pages/DPVisualizer";
import CustomCode from "./pages/CustomCode";
import CodePlayground from "./pages/CodePlayground";
import AICodeAudit from "./pages/AICodeAudit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sorting" element={<SortingVisualizer />} />
          <Route path="/graph" element={<GraphVisualizer />} />
          <Route path="/dp" element={<DPVisualizer />} />
          <Route path="/custom" element={<CustomCode />} />
          <Route path="/playground" element={<CodePlayground />} />
          <Route path="/audit" element={<AICodeAudit />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
