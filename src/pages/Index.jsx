import React, { useState, useRef, useEffect } from 'react';
import StarMap from '../components/StarMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const constellations = [
  { name: 'Orion', coordinates: { x: 83.82, y: 5.39, z: -2.42 } },
  { name: 'Ursa Major', coordinates: { x: 165.46, y: 61.75, z: -8.93 } },
  { name: 'Cassiopeia', coordinates: { x: 10.68, y: 59.15, z: 2.36 } },
  { name: 'Leo', coordinates: { x: 177.47, y: 14.47, z: -10.76 } },
  { name: 'Scorpius', coordinates: { x: 247.36, y: -26.43, z: -4.22 } },
  { name: 'Taurus', coordinates: { x: 66.57, y: 16.51, z: -3.74 } },
  { name: 'Gemini', coordinates: { x: 113.65, y: 28.03, z: -8.11 } },
  { name: 'Cygnus', coordinates: { x: 305.56, y: 40.73, z: 4.22 } },
  { name: 'Canis Major', coordinates: { x: 101.28, y: -16.71, z: -5.13 } },
  { name: 'Lyra', coordinates: { x: 284.74, y: 32.69, z: 4.48 } },
  { name: 'Aquila', coordinates: { x: 297.69, y: 8.87, z: 3.71 } },
  { name: 'Pegasus', coordinates: { x: 344.41, y: 15.21, z: 3.51 } },
];

const Index = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });
  const [autoplay, setAutoplay] = useState(false);
  const [skyboxUrl, setSkyboxUrl] = useState('https://jayrosen.design/nasa/GalaxyTex_NegativeX.png');
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

  const handleConstellationChange = (constellationName) => {
    const constellation = constellations.find(c => c.name === constellationName);
    if (constellation) {
      setCoordinates(constellation.coordinates);
      if (starMapRef.current) {
        starMapRef.current.navigateToCoordinates(constellation.coordinates);
      }
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
          <div className="flex items-center space-x-2">
            <Select onValueChange={handleConstellationChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Constellation" />
              </SelectTrigger>
              <SelectContent>
                {constellations.map((constellation) => (
                  <SelectItem key={constellation.name} value={constellation.name}>
                    {constellation.name}
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