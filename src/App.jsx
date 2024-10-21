import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import MobileNavbar from './components/MobileNavbar';
import Sidebar from './components/Sidebar';
import Constellations from './pages/Constellations';
import ExoPlanetExplorer from './pages/ExoPlanetExplorer';
import About from './pages/About';
import Kepler37d from './pages/Kepler37d';
import DrawConstellation from './pages/DrawConstellation';
import RupertsDownloads from './pages/RupertsDownloads';

const queryClient = new QueryClient();

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // Assuming 1024px as the breakpoint for large screens
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <div className="relative min-h-screen bg-background text-foreground">
              <MobileNavbar toggleSidebar={toggleSidebar} />
              <Sidebar isOpen={isLargeScreen || isSidebarOpen} toggleSidebar={toggleSidebar} />
              <main className={`pt-16 ${isLargeScreen ? 'ml-64' : ''}`}>
                <Routes>
                  <Route path="/" element={<Navigate to="/exo-planet-explorer" replace />} />
                  <Route path="/exo-planet-explorer" element={<ExoPlanetExplorer />} />
                  <Route path="/constellations" element={<Constellations />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/kepler37d" element={<Kepler37d />} />
                  <Route path="/draw-constellation" element={<DrawConstellation />} />
                  <Route path="/ruperts-downloads" element={<RupertsDownloads />} />
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