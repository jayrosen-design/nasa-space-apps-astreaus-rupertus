import React, { useState, useRef } from 'react';
import StarMap from '../components/StarMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { constellations, zoomOptions, exoplanets, skyboxOptions } from '../data/starMapData';

const Index = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });
  const [autoplay, setAutoplay] = useState(false);
  const [skyboxUrl, setSkyboxUrl] = useState('https://i.imgur.com/VhVRrHk.jpeg');
  const [zoom, setZoom] = useState(35);
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [selectedExoplanet, setSelectedExoplanet] = useState(null);
  const starMapRef = useRef(null);
  const { theme, setTheme } = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoordinates(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    starMapRef.current?.navigateToCoordinates(coordinates);
  };

  const handleSkyboxChange = (value) => {
    setSkyboxUrl(value);
    starMapRef.current?.updateSkybox(value);
  };

  const handleConstellationChange = (constellationName) => {
    const constellation = constellations.find(c => c.name === constellationName);
    if (constellation) {
      setSelectedConstellation(constellation);
      setCoordinates(constellation.coordinates);
      starMapRef.current?.navigateToCoordinates(constellation.coordinates);
    }
  };

  const handleZoomChange = (value) => {
    setZoom(parseInt(value));
    starMapRef.current?.setZoom(parseInt(value));
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
      starMapRef.current?.addExoplanet(exoplanet.exoplanet_name, coords);
      starMapRef.current?.navigateToExoplanet(exoplanet.exoplanet_name);
    }
  };

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
      </div>
      {selectedExoplanet && (
        <div className="absolute bottom-4 right-4 bg-background/80 p-4 rounded-lg shadow-lg max-w-sm">
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
  );
};

export default Index;
