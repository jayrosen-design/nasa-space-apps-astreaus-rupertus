import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="p-4">
        <Button variant="ghost" onClick={toggleSidebar} className="absolute top-4 right-4 text-white">
          <X className="h-6 w-6" />
        </Button>
        <nav className="mt-8">
          <ul className="space-y-2">
            <li><Link to="/" className="block py-2 hover:bg-gray-700" onClick={toggleSidebar}>Kepler-37d</Link></li>
            <li><Link to="/constellations" className="block py-2 hover:bg-gray-700" onClick={toggleSidebar}>Constellations</Link></li>
            <li><Link to="/exoplanets" className="block py-2 hover:bg-gray-700" onClick={toggleSidebar}>Exoplanets</Link></li>
            <li><Link to="/exospace" className="block py-2 hover:bg-gray-700" onClick={toggleSidebar}>Go to ExoSpace</Link></li>
            <li><Link to="/about" className="block py-2 hover:bg-gray-700" onClick={toggleSidebar}>About</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;