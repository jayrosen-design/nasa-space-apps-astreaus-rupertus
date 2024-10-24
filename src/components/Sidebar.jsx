import React from 'react';
import { Link } from 'react-router-dom';
import { X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50 lg:translate-x-0`}>
      <div className="p-4">
        <Button variant="ghost" onClick={toggleSidebar} className="absolute top-4 right-4 text-white lg:hidden">
          <X className="h-6 w-6" />
        </Button>
        <nav className="mt-8">
          <ul className="space-y-2">
            <li><Link to="/exo-planet-explorer" className="block py-2 hover:bg-gray-700" onClick={toggleSidebar}>Exo-Planet Explorer</Link></li>
            <li><Link to="/constellations" className="block py-2 hover:bg-gray-700" onClick={toggleSidebar}>Star Map</Link></li>
            <li><Link to="/draw-constellation" className="block py-2 hover:bg-gray-700" onClick={toggleSidebar}>Draw Constellation</Link></li>
            <li><Link to="/ruperts-downloads" className="block py-2 hover:bg-gray-700" onClick={toggleSidebar}>Rupert's Downloads</Link></li>
            <li><a href="https://www.spaceappschallenge.org/nasa-space-apps-2024/find-a-team/astreaus-rupertus/" target="_blank" rel="noopener noreferrer" className="block py-2 hover:bg-gray-700" onClick={toggleSidebar}>NASA Space Apps</a></li>
            <li><Link to="/about" className="block py-2 hover:bg-gray-700" onClick={toggleSidebar}>About</Link></li>
          </ul>
        </nav>
        <Button variant="ghost" onClick={toggleTheme} className="mt-4 text-white">
          {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          <span className="ml-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;