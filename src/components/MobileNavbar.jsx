import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileNavbar = ({ toggleSidebar }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between z-50">
      <Button variant="ghost" onClick={toggleSidebar} className="text-white">
        <Menu className="h-6 w-6" />
      </Button>
      <h1 className="text-xl font-bold text-center flex-grow">Astreaus Rupertus</h1>
    </nav>
  );
};

export default MobileNavbar;