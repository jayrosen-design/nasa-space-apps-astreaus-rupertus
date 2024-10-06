import React, { useState, useRef, useEffect } from 'react';
import StarMap from '../components/StarMap';
import { constellations, zoomOptions, exoplanets, skyboxOptions, constellationStars } from '../data/starMapData';
import ControlPanel from '../components/ControlPanel';
import ExoplanetInfo from '../components/ExoplanetInfo';
import { useTheme } from 'next-themes';

const Index = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });
  const [autoplay, setAutoplay] = useState(false);
  const [skyboxUrl, setSkyboxUrl] = useState('https://i.imgur.com/VhVRrHk.jpeg');
  const [zoom, setZoom] = useState(35);
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [selectedExoplanet, setSelectedExoplanet] = useState(null);
  const [showExoplanets, setShowExoplanets] = useState(true);
  const starMapRef = useRef(null);
  const { theme, setTheme } = useTheme();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoordinates(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigateToCoordinates(coordinates);
  };

  const navigateToCoordinates = (coords) => {
    setCoordinates(coords);
    starMapRef.current?.navigateToCoordinates(coords);
  };

  const handleSkyboxChange = (value) => {
    setSkyboxUrl(value);
    starMapRef.current?.updateSkybox(value);
  };

  const handleConstellationChange = (constellationName) => {
    const constellation = constellations.find(c => c.name === constellationName);
    if (constellation) {
      setSelectedConstellation(constellation);
      navigateToCoordinates(constellation.coordinates);
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

  const handleConstellationStarChange = (constellationName) => {
    setSelectedConstellation(constellationName);
    const stars = constellationStars.filter(star => star.constellation === constellationName);
    if (stars.length > 0) {
      const firstStar = stars[0];
      const coords = {
        x: Math.cos(firstStar.ra * Math.PI / 180) * Math.cos(firstStar.dec * Math.PI / 180) * 400,
        y: Math.sin(firstStar.dec * Math.PI / 180) * 400,
        z: Math.sin(firstStar.ra * Math.PI / 180) * Math.cos(firstStar.dec * Math.PI / 180) * 400
      };
      navigateToCoordinates(coords);
    }
  };

  useEffect(() => {
    let autoplayInterval;
    if (autoplay) {
      autoplayInterval = setInterval(() => {
        starMapRef.current?.rotateSkybox(0.001); // Slow rotation
      }, 16); // ~60 fps
    }
    return () => {
      clearInterval(autoplayInterval);
    };
  }, [autoplay]);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <StarMap 
        ref={starMapRef} 
        initialSkyboxUrl={skyboxUrl} 
        showExoplanets={showExoplanets}
        constellationStars={constellationStars}
      />
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
        showExoplanets={showExoplanets}
        setShowExoplanets={setShowExoplanets}
        selectedConstellation={selectedConstellation}
        handleConstellationStarChange={handleConstellationStarChange}
      />
      {selectedExoplanet && <ExoplanetInfo exoplanet={selectedExoplanet} />}
    </div>
  );
};

export default Index;
