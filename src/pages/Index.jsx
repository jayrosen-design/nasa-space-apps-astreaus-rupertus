import React, { useState, useRef, useEffect } from 'react';
import StarMap from '../components/StarMap';
import { constellations, zoomOptions, exoplanets, skyboxOptions, constellationStars } from '../data/starMapData';
import ControlPanel from '../components/ControlPanel';
import { useTheme } from 'next-themes';

const Index = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });
  const [autoplay, setAutoplay] = useState(false);
  const [skyboxUrl, setSkyboxUrl] = useState('https://i.imgur.com/VhVRrHk.jpeg');
  const [zoom, setZoom] = useState(35);
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [selectedExoplanet, setSelectedExoplanet] = useState(null);
  const [showExoplanets, setShowExoplanets] = useState(true);
  const [showStarNames, setShowStarNames] = useState(true);
  const [showConstellationLines, setShowConstellationLines] = useState(true);
  const [selectedStar, setSelectedStar] = useState(null);
  const starMapRef = useRef(null);
  const { theme, setTheme } = useTheme();

  const navigateToCoordinates = (coords) => {
    setCoordinates(coords);
    starMapRef.current?.navigateToCoordinates(coords);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoordinates(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigateToCoordinates(coordinates);
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
    if (exoplanet && showExoplanets) {
      setSelectedExoplanet(exoplanet);
      starMapRef.current?.navigateToExoplanet(exoplanet.exoplanet_name);
    } else if (!showExoplanets) {
      console.log("Exoplanets are currently hidden. Please enable them to navigate.");
    }
  };

  const handleConstellationStarChange = (starName) => {
    const star = constellationStars.find(s => s.star_name === starName);
    if (star) {
      setSelectedStar(star);
      const coords = {
        x: Math.cos(star.ra * Math.PI / 180) * Math.cos(star.dec * Math.PI / 180) * 400,
        y: Math.sin(star.dec * Math.PI / 180) * 400,
        z: -Math.sin(star.ra * Math.PI / 180) * Math.cos(star.dec * Math.PI / 180) * 400
      };
      navigateToCoordinates(coords);
    }
  };

  const handleStarClick = (star) => {
    setSelectedStar(star);
    setSelectedExoplanet(null);
    setSelectedConstellation(null);
    const coords = {
      x: Math.cos(star.ra * Math.PI / 180) * Math.cos(star.dec * Math.PI / 180) * 400,
      y: Math.sin(star.dec * Math.PI / 180) * 400,
      z: -Math.sin(star.ra * Math.PI / 180) * Math.cos(star.dec * Math.PI / 180) * 400
    };
    navigateToCoordinates(coords);
  };

  const handleExoplanetClick = (exoplanet) => {
    setSelectedExoplanet(exoplanet);
    setSelectedStar(null);
    setSelectedConstellation(null);
    starMapRef.current?.navigateToExoplanet(exoplanet.exoplanet_name);
  };

  useEffect(() => {
    let autoplayInterval;
    if (autoplay) {
      autoplayInterval = setInterval(() => {
        starMapRef.current?.rotateSkybox(0.001);
      }, 16);
    }
    return () => clearInterval(autoplayInterval);
  }, [autoplay]);

  const getTitle = () => {
    if (selectedStar) return selectedStar.star_name;
    if (selectedExoplanet) return selectedExoplanet.exoplanet_name;
    if (selectedConstellation) return selectedConstellation.name;
    return 'Milky Way Galaxy';
  };

  const getDescription = () => {
    if (selectedStar) return `Constellation: ${selectedStar.constellation} • Magnitude: ${selectedStar.magnitude}`;
    if (selectedExoplanet) return `${selectedExoplanet.host_star} • ${selectedExoplanet.distance_light_years} Light Years from Earth`;
    if (selectedConstellation) return `${selectedConstellation.stars} Stars • ${selectedConstellation.distance} Light Years from Earth`;
    return 'Estimated 100-400 billion stars • 100,000 light years in diameter';
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <StarMap 
        ref={starMapRef} 
        initialSkyboxUrl={skyboxUrl} 
        showExoplanets={showExoplanets}
        showStarNames={showStarNames}
        showConstellationLines={showConstellationLines}
        constellationStars={constellationStars}
        onStarClick={handleStarClick}
        onExoplanetClick={handleExoplanetClick}
        autoplay={autoplay}
      />
      <div className="absolute top-0 left-0 right-0 p-4 text-center">
        <h1 className="text-8xl font-bold mb-2">{getTitle()}</h1>
        <p className="text-xl">{getDescription()}</p>
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
        showStarNames={showStarNames}
        setShowStarNames={setShowStarNames}
        showConstellationLines={showConstellationLines}
        setShowConstellationLines={setShowConstellationLines}
        selectedExoplanet={selectedExoplanet}
        selectedStar={selectedStar}
        constellationStars={constellationStars}
      />
    </div>
  );
};

export default Index;
