import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LuxuryPropertyDetail from "./components/luxury/LuxuryPropertyDetail";
import LuxuryPropertyDetailV2 from "./components/luxury/LuxuryPropertyDetailV2";
import LuxuryPropertyListing from "./components/luxury/LuxuryPropertyListing";
import BlogListingPage from "./components/luxury/BlogListingPage";
import Home2PropertiesPage from "./components/home-2/Home2PropertiesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<LuxuryPropertyListing />} />
          <Route path="/property/:id" element={<LuxuryPropertyDetail />} />
          <Route path="/property-v2/:id" element={<LuxuryPropertyDetailV2 />} />
          <Route path="/blog" element={<BlogListingPage />} />
          <Route path="/home2/properties" element={<Home2PropertiesPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
