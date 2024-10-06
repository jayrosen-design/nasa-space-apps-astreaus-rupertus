import React, { useState, useRef, useEffect } from 'react';
import StarMap from '../components/StarMap';
import { constellations, exoplanets, skyboxOptions, constellationStars } from '../data/starMapData';
import ControlPanel from '../components/ControlPanel';
import { useTheme } from 'next-themes';
import { playBackgroundMusic, stopBackgroundMusic } from '../utils/audio';

const Index = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });
  const [autoplay, setAutoplay] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedObjectType, setSelectedObjectType] = useState(null);
  const [showExoplanets, setShowExoplanets] = useState(true);
  const [showStarNames, setShowStarNames] = useState(true);
  const [showConstellationLines, setShowConstellationLines] = useState(true);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
  const starMapRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const [activeSkyboxes, setActiveSkyboxes] = useState([skyboxOptions[0]]);
  const [isControlPanelVisible, setIsControlPanelVisible] = useState(true);
  const [isDrawMode, setIsDrawMode] = useState(false);

  useEffect(() => {
    if (isBackgroundMusicPlaying) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }, [isBackgroundMusicPlaying]);

  const toggleControlPanelVisibility = () => {
    setIsControlPanelVisible(prev => !prev);
  };

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

  const handleConstellationChange = (constellationName) => {
    const constellation = constellations.find(c => c.name === constellationName);
    if (constellation) {
      setSelectedObject(constellation);
      setSelectedObjectType('constellation');
      navigateToCoordinates(constellation.coordinates);
    }
  };

  const handleExoplanetChange = (exoplanetName) => {
    const exoplanet = exoplanets.find(e => e.exoplanet_name === exoplanetName);
    if (exoplanet && showExoplanets) {
      setSelectedObject(exoplanet);
      setSelectedObjectType('exoplanet');
      starMapRef.current?.navigateToExoplanet(exoplanetName);
    } else if (!showExoplanets) {
      console.log("Exoplanets are currently hidden. Please enable them to navigate.");
    }
  };

  const handleConstellationStarChange = (starName) => {
    const star = constellationStars.find(s => s.star_name === starName);
    if (star) {
      setSelectedObject(star);
      setSelectedObjectType('star');
      starMapRef.current?.navigateToStar(starName);
    }
  };

  const handleStarClick = (star) => {
    setSelectedObject(star);
    setSelectedObjectType('star');
    starMapRef.current?.navigateToStar(star.star_name);
  };

  const handleExoplanetClick = (exoplanet) => {
    setSelectedObject(exoplanet);
    setSelectedObjectType('exoplanet');
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
    if (!selectedObject) return 'Milky Way Galaxy';
    switch (selectedObjectType) {
      case 'star':
        return selectedObject.star_name;
      case 'exoplanet':
        return selectedObject.exoplanet_name;
      case 'constellation':
        return selectedObject.name;
      default:
        return 'Milky Way Galaxy';
    }
  };

  const getDescription = () => {
    if (!selectedObject) return 'Estimated 100-400 billion stars • 100,000 light years in diameter';
    switch (selectedObjectType) {
      case 'star':
        return `Constellation: ${selectedObject.constellation} • Magnitude: ${selectedObject.magnitude}`;
      case 'exoplanet':
        return `${selectedObject.host_star} • ${selectedObject.distance_light_years} Light Years from Earth`;
      case 'constellation':
        return `${selectedObject.stars} Stars • ${selectedObject.distance} Light Years from Earth`;
      default:
        return 'Estimated 100-400 billion stars • 100,000 light years in diameter';
    }
  };

  const handleSkyboxToggle = (skyboxOption, isChecked) => {
    setActiveSkyboxes(prev => {
      if (isChecked) {
        return [...prev, skyboxOption];
      } else {
        return prev.filter(sb => sb.label !== skyboxOption.label);
      }
    });
  };

  const handleSaveImage = () => {
    starMapRef.current?.saveImage();
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <StarMap 
        ref={starMapRef} 
        showExoplanets={showExoplanets}
        showStarNames={showStarNames}
        showConstellationLines={showConstellationLines}
        constellationStars={constellationStars}
        onStarClick={handleStarClick}
        onExoplanetClick={handleExoplanetClick}
        autoplay={autoplay}
        activeSkyboxes={activeSkyboxes}
        isDrawMode={isDrawMode}
      />
      <div className="absolute top-0 left-0 right-0 p-4 text-center">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-2">{getTitle()}</h1>
        <p className="text-sm sm:text-base md:text-xl">{getDescription()}</p>
      </div>
      <ControlPanel
        coordinates={coordinates}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        autoplay={autoplay}
        setAutoplay={setAutoplay}
        theme={theme}
        setTheme={setTheme}
        handleConstellationChange={handleConstellationChange}
        handleExoplanetChange={handleExoplanetChange}
        skyboxOptions={skyboxOptions}
        constellations={constellations}
        exoplanets={exoplanets}
        showExoplanets={showExoplanets}
        setShowExoplanets={setShowExoplanets}
        selectedConstellation={selectedObjectType === 'constellation' ? selectedObject : null}
        handleConstellationStarChange={handleConstellationStarChange}
        showStarNames={showStarNames}
        setShowStarNames={setShowStarNames}
        showConstellationLines={showConstellationLines}
        setShowConstellationLines={setShowConstellationLines}
        selectedExoplanet={selectedObjectType === 'exoplanet' ? selectedObject : null}
        selectedStar={selectedObjectType === 'star' ? selectedObject : null}
        constellationStars={constellationStars}
        activeSkyboxes={activeSkyboxes}
        handleSkyboxToggle={handleSkyboxToggle}
        isVisible={isControlPanelVisible}
        toggleVisibility={toggleControlPanelVisibility}
        isBackgroundMusicPlaying={isBackgroundMusicPlaying}
        setIsBackgroundMusicPlaying={setIsBackgroundMusicPlaying}
        isDrawMode={isDrawMode}
        setIsDrawMode={setIsDrawMode}
        handleSaveImage={handleSaveImage}
      />
    </div>
  );
};

export default Index;
