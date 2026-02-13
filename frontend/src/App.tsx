import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/shared/ScrollToTop";

// Lazy-loaded pages — each chunk is fetched only when the route is visited
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Admission = lazy(() => import("./pages/Admission"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const Notices = lazy(() => import("./pages/Notices"));
const NoticeDetail = lazy(() => import("./pages/NoticeDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/admission" element={<Admission />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/notices" element={<Notices />} />
                <Route path="/notices/:id" element={<NoticeDetail />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
