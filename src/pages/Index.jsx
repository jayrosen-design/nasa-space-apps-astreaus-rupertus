import React, { useState, useRef, useEffect } from 'react';
import StarMap from '../components/StarMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Index = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });
  const [autoplay, setAutoplay] = useState(false);
  const [skyboxUrl, setSkyboxUrl] = useState('https://jayrosen.design/nasa/skybox-space.jpg');
  const starMapRef = useRef(null);

  const skyboxOptions = [
    { label: 'Galaxy Texture', value: 'https://jayrosen.design/nasa/GalaxyTex_NegativeX.png' },
    { label: 'Space', value: 'https://jayrosen.design/nasa/skybox-space.jpg' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newCoordinates = { ...coordinates, [name]: parseFloat(value) };
    setCoordinates(newCoordinates);
    if (starMapRef.current) {
      starMapRef.current.rotateSkybox(newCoordinates);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (starMapRef.current) {
      starMapRef.current.navigateToCoordinates(coordinates);
    }
  };

  const handleSkyboxChange = (value) => {
    setSkyboxUrl(value);
    if (starMapRef.current) {
      starMapRef.current.updateSkybox(value);
    }
  };

  useEffect(() => {
    let intervalId;
    if (autoplay) {
      intervalId = setInterval(() => {
        const newCoordinates = {
          x: coordinates.x + 0.1,
          y: coordinates.y + 0.1,
          z: coordinates.z + 0.1
        };
        setCoordinates(newCoordinates);
        if (starMapRef.current) {
          starMapRef.current.rotateSkybox(newCoordinates);
        }
      }, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoplay, coordinates]);

  return (
    <div className="relative min-h-screen">
      <StarMap ref={starMapRef} initialSkyboxUrl={skyboxUrl} />
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2 items-center">
          <div className="flex space-x-2 justify-center">
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
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoplay"
              checked={autoplay}
              onCheckedChange={setAutoplay}
            />
            <label
              htmlFor="autoplay"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Autoplay
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Select onValueChange={handleSkyboxChange} defaultValue={skyboxUrl}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Skybox" />
              </SelectTrigger>
              <SelectContent>
                {skyboxOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;