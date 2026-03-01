import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LuxuryPropertyDetail from "./components/luxury/LuxuryPropertyDetail";
import LuxuryPropertyDetailV2 from "./components/luxury/LuxuryPropertyDetailV2";
import LuxuryPropertyDetailV3 from "./components/luxury/LuxuryPropertyDetailV3";
import LuxuryPropertyDetailV4 from "./components/luxury/LuxuryPropertyDetailV4";
import LuxuryPropertyListing from "./components/luxury/LuxuryPropertyListing";
import BlogListingPage from "./components/luxury/BlogListingPage";
import BlogDetailPage from "./components/luxury/BlogDetailPage";
import SystemPage from "./components/luxury/SystemPage";
import ContactPage from "./components/luxury/ContactPage";
import Home2PropertiesPage from "./components/home-2/Home2PropertiesPage";
import PropertyPdfV1 from "./components/luxury/pdf/PropertyPdfV1";
import PropertyPdfV2 from "./components/luxury/pdf/PropertyPdfV2";

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
          <Route path="/property-v3/:id" element={<LuxuryPropertyDetailV3 />} />
          <Route path="/property-v4/:id" element={<LuxuryPropertyDetailV4 />} />
          <Route path="/pdf-v1/:id" element={<PropertyPdfV1 />} />
          <Route path="/pdf-v2/:id" element={<PropertyPdfV2 />} />
          <Route path="/blog" element={<BlogListingPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/page/:slug" element={<SystemPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/home2/properties" element={<Home2PropertiesPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
