import React, { useState, useRef, useEffect } from 'react';
import StarMap from '../components/StarMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const constellations = [
const constellations = [
  { name: 'Orion', coordinates: { x: 83.82, y: 5.39, z: -2.42 }, stars: 7, distance: 1344 },
  { name: 'Ursa Major', coordinates: { x: 165.46, y: 61.75, z: -8.93 }, stars: 7, distance: 80 },
  { name: 'Cassiopeia', coordinates: { x: 10.68, y: 59.15, z: 2.36 }, stars: 5, distance: 228 },
  { name: 'Leo', coordinates: { x: 177.47, y: 14.47, z: -10.76 }, stars: 9, distance: 77 },
  { name: 'Scorpius', coordinates: { x: 247.36, y: -26.43, z: -4.22 }, stars: 18, distance: 604 },
  { name: 'Taurus', coordinates: { x: 66.57, y: 16.51, z: -3.74 }, stars: 19, distance: 65 },
  { name: 'Gemini', coordinates: { x: 113.65, y: 28.03, z: -8.11 }, stars: 17, distance: 52 },
  { name: 'Cygnus', coordinates: { x: 305.56, y: 40.73, z: 4.22 }, stars: 9, distance: 1400 },
  { name: 'Canis Major', coordinates: { x: 101.28, y: -16.71, z: -5.13 }, stars: 8, distance: 8.6 },
  { name: 'Lyra', coordinates: { x: 284.74, y: 32.69, z: 4.48 }, stars: 5, distance: 25 },
  { name: 'Aquila', coordinates: { x: 297.69, y: 8.87, z: 3.71 }, stars: 10, distance: 17 },
  { name: 'Pegasus', coordinates: { x: 344.41, y: 15.21, z: 3.51 }, stars: 9, distance: 133 },
];
];

const zoomOptions = [
const zoomOptions = [
  { label: '10mm', value: 10 },
  { label: '12mm', value: 12 },
  { label: '16mm', value: 16 },
  { label: '35mm', value: 35 },
  { label: '55mm', value: 55 },
  { label: '100mm', value: 100 },
  { label: '135mm', value: 135 },
  { label: '250mm', value: 250 },
  { label: '350mm', value: 350 },
  { label: '500mm', value: 500 },
];
];

const exoplanets = [
  { exoplanet_name: 'Proxima Centauri b', host_star: 'Proxima Centauri', distance_light_years: 4.24, planet_type: 'Rocky' },
  { exoplanet_name: 'TRAPPIST-1e', host_star: 'TRAPPIST-1', distance_light_years: 39.5, planet_type: 'Rocky' },
  // ... add the rest of the exoplanets data here
];

const Index = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });
  const [autoplay, setAutoplay] = useState(false);
  const [skyboxUrl, setSkyboxUrl] = useState('https://imgur.com/VhVRrHk.jpg');
  const [zoom, setZoom] = useState(35);
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [selectedExoplanet, setSelectedExoplanet] = useState(null);
  const starMapRef = useRef(null);
  const { theme, setTheme } = useTheme();

  const skyboxOptions = [
    { label: 'Galaxy Texture', value: 'https://imgur.com/VhVRrHk.jpg' },
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
      setSelectedConstellation(constellation);
      setCoordinates(constellation.coordinates);
      if (starMapRef.current) {
        starMapRef.current.navigateToCoordinates(constellation.coordinates);
      }
    }
  };

  const handleZoomChange = (value) => {
    setZoom(parseInt(value));
    if (starMapRef.current) {
      starMapRef.current.setZoom(parseInt(value));
    }
  };

  const handleExoplanetChange = (exoplanetName) => {
    const exoplanet = exoplanets.find(e => e.exoplanet_name === exoplanetName);
    if (exoplanet) {
      setSelectedExoplanet(exoplanet);
      const coords = {
        x: Math.random() * 1000 - 500,
        y: Math.random() * 1000 - 500,
        z: Math.random() * 1000 - 500
      };
      if (starMapRef.current) {
        starMapRef.current.addExoplanet(exoplanet.exoplanet_name, coords);
        starMapRef.current.navigateToExoplanet(exoplanet.exoplanet_name);
      }
    }
  };

  // ... keep existing useEffect for autoplay

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <StarMap ref={starMapRef} initialSkyboxUrl={skyboxUrl} />
      <div className="absolute top-0 left-0 right-0 p-4 text-center">
        <h1 className="text-8xl font-bold mb-2">
          {selectedExoplanet ? selectedExoplanet.exoplanet_name : (selectedConstellation ? selectedConstellation.name : 'Milky Way Galaxy')}
        </h1>
        <p className="text-xl">
          {selectedExoplanet
            ? `${selectedExoplanet.host_star} • ${selectedExoplanet.distance_light_years} Light Years from Earth`
            : (selectedConstellation
              ? `${selectedConstellation.stars} Stars • ${selectedConstellation.distance} Light Years from Earth`
              : 'Estimated 100-400 billion stars • 100,000 light years in diameter')}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-background p-4 shadow">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2 items-center">
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
          <div className="flex items-center space-x-4">
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
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              />
              <label
                htmlFor="dark-mode"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Dark Mode
              </label>
            </div>
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
            <Select onValueChange={handleZoomChange} defaultValue={zoom}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Zoom" />
              </SelectTrigger>
              <SelectContent>
                {zoomOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleExoplanetChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Exoplanet" />
              </SelectTrigger>
              <SelectContent>
                {exoplanets.map((exoplanet) => (
                  <SelectItem key={exoplanet.exoplanet_name} value={exoplanet.exoplanet_name}>
                    {exoplanet.exoplanet_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
        {selectedExoplanet && (
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(selectedExoplanet).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key.replace(/_/g, ' ')}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
