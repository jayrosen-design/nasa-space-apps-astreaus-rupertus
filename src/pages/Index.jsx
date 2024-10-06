import React, { useState, useRef, useEffect } from 'react';
import StarMap from '../components/StarMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { constellations, zoomOptions, exoplanets, skyboxOptions } from '../data/starMapData';
import ControlPanel from '../components/ControlPanel';
import ExoplanetInfo from '../components/ExoplanetInfo';

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

  useEffect(() => {
    let intervalId;
    if (autoplay) {
      intervalId = setInterval(() => {
        const newCoords = {
          x: Math.random() * 1000 - 500,
          y: Math.random() * 1000 - 500,
          z: Math.random() * 1000 - 500
        };
        setCoordinates(newCoords);
        starMapRef.current?.navigateToCoordinates(newCoords);
      }, 5000); // Change position every 5 seconds
    }
    return () => clearInterval(intervalId);
  }, [autoplay]);

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
      <ControlPanel
        coordinates={coordinates}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        autoplay={autoplay}
        setAutoplay={setAutoplay}
        theme={theme}
        setTheme={setTheme}
        skyboxUrl={skyboxUrl}
        handleSkyboxChange={handleSkyboxChange}
        handleConstellationChange={handleConstellationChange}
        zoom={zoom}
        handleZoomChange={handleZoomChange}
        handleExoplanetChange={handleExoplanetChange}
        skyboxOptions={skyboxOptions}
        constellations={constellations}
        zoomOptions={zoomOptions}
        exoplanets={exoplanets}
      />
      {selectedExoplanet && <ExoplanetInfo exoplanet={selectedExoplanet} />}
    </div>
  );
};

export default Index;