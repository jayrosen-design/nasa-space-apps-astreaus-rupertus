import React, { useState } from 'react';
import StarMap from '../components/StarMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoordinates(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement navigation to the specified coordinates
    console.log('Navigating to:', coordinates);
  };

  return (
    <div className="relative min-h-screen">
      <StarMap />
      <div className="absolute top-4 left-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Navigate to Coordinates</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="number"
            name="x"
            value={coordinates.x}
            onChange={handleInputChange}
            placeholder="X"
          />
          <Input
            type="number"
            name="y"
            value={coordinates.y}
            onChange={handleInputChange}
            placeholder="Y"
          />
          <Input
            type="number"
            name="z"
            value={coordinates.z}
            onChange={handleInputChange}
            placeholder="Z"
          />
          <Button type="submit">Navigate</Button>
        </form>
      </div>
    </div>
  );
};

export default Index;