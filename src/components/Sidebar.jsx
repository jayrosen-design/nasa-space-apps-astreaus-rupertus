import React from 'react';
import { Link } from 'react-router-dom';
import { X, Moon, Sun, Constellation, Planet, Rocket, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="p-4">
        <Button variant="ghost" onClick={toggleSidebar} className="absolute top-4 right-4 text-white">
          <X className="h-6 w-6" />
        </Button>
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <Link to="/constellations" className="flex items-center py-2 px-4 hover:bg-gray-700" onClick={toggleSidebar}>
                <Constellation className="h-5 w-5 mr-3" />
                Constellations
              </Link>
            </li>
            <li>
              <Link to="/exoplanets" className="flex items-center py-2 px-4 hover:bg-gray-700" onClick={toggleSidebar}>
                <Planet className="h-5 w-5 mr-3" />
                Exoplanets
              </Link>
            </li>
            <li>
              <Link to="/kepler37d" className="flex items-center py-2 px-4 hover:bg-gray-700" onClick={toggleSidebar}>
                <Planet className="h-5 w-5 mr-3" />
                Kepler-37d
              </Link>
            </li>
            <li>
              <Link to="/exospace" className="flex items-center py-2 px-4 hover:bg-gray-700" onClick={toggleSidebar}>
                <Rocket className="h-5 w-5 mr-3" />
                Go to ExoSpace
              </Link>
            </li>
            <li>
              <Link to="/about" className="flex items-center py-2 px-4 hover:bg-gray-700" onClick={toggleSidebar}>
                <Info className="h-5 w-5 mr-3" />
                About
              </Link>
            </li>
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