import React, { useState, useRef } from 'react';
import StarMap from '../components/StarMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });
  const starMapRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoordinates(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (starMapRef.current) {
      starMapRef.current.navigateToCoordinates(coordinates);
    }
  };

  return (
    <div className="relative min-h-screen">
      <StarMap ref={starMapRef} />
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow">
        <form onSubmit={handleSubmit} className="flex space-x-2 justify-center">
          <Input
            type="number"
            name="x"
            value={coordinates.x}
            onChange={handleInputChange}
            placeholder="X"
            className="w-20"
          />
          <Input
            type="number"
            name="y"
            value={coordinates.y}
            onChange={handleInputChange}
            placeholder="Y"
            className="w-20"
          />
          <Input
            type="number"
            name="z"
            value={coordinates.z}
            onChange={handleInputChange}
            placeholder="Z"
            className="w-20"
          />
          <Button type="submit">Navigate</Button>
        </form>
      </div>
    </div>
  );
};

export default Index;