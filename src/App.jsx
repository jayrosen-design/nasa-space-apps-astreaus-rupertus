import React, { useState } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import MobileNavbar from './components/MobileNavbar';
import Sidebar from './components/Sidebar';
import Constellations from './pages/Constellations';
import Exoplanets from './pages/Exoplanets';
import ExoSpace from './pages/ExoSpace';
import About from './pages/About';
import Kepler37d from './pages/Kepler37d';

const queryClient = new QueryClient();

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <div className="relative min-h-screen bg-background text-foreground">
              <MobileNavbar toggleSidebar={toggleSidebar} />
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Navigate to="/constellations" replace />} />
                  <Route path="/constellations" element={<Constellations />} />
                  <Route path="/exoplanets" element={<Exoplanets />} />
                  <Route path="/exospace" element={<ExoSpace />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/kepler37d" element={<Kepler37d />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;