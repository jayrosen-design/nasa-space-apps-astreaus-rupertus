import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarMap from '../components/StarMap';
import ControlPanel from '../components/ControlPanel';
import { skyboxOptions } from '../data/starMapData';
import { useTheme } from 'next-themes';
import { playBackgroundMusic, stopBackgroundMusic } from '../utils/audio';

const Index = () => {
  const [autoplay, setAutoplay] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedObjectType, setSelectedObjectType] = useState(null);
  const [showExoplanets, setShowExoplanets] = useState(true);
  const [showStarNames, setShowStarNames] = useState(true);
  const [showConstellationLines, setShowConstellationLines] = useState(false);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
  const starMapRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const [activeSkyboxes, setActiveSkyboxes] = useState([skyboxOptions[0]]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isBackgroundMusicPlaying) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }, [isBackgroundMusicPlaying]);

  const handleObjectClick = (object) => {
    setSelectedObject(object);
    setSelectedObjectType(object.type);
    if (object.name === 'Kepler-37d' || object.name === 'Aldebaran') {
      navigate('/exospace');
    } else if (starMapRef.current) {
      starMapRef.current.navigateToObject(object.name);
    }
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

  return (
    <div className="relative h-screen bg-background text-foreground">
      <div className="absolute top-4 left-4 z-10 bg-background/80 p-2 rounded">
        <h1 className="text-2xl font-bold">Kepler-37d</h1>
      </div>
      <StarMap 
        ref={starMapRef} 
        showExoplanets={showExoplanets}
        showStarNames={showStarNames}
        showConstellationLines={showConstellationLines}
        onObjectClick={handleObjectClick}
        autoplay={autoplay}
        activeSkyboxes={activeSkyboxes}
        initialObjects={[
          { name: 'Kepler-37d', type: 'exoplanet', color: 'orange', size: 2 },
          { name: 'Aldebaran', type: 'star', color: 'red', size: 5 }
        ]}
      />
      <ControlPanel
        showExoplanets={showExoplanets}
        setShowExoplanets={setShowExoplanets}
        showStarNames={showStarNames}
        setShowStarNames={setShowStarNames}
        showConstellationLines={showConstellationLines}
        setShowConstellationLines={setShowConstellationLines}
        selectedObject={selectedObject}
        selectedObjectType={selectedObjectType}
        skyboxOptions={skyboxOptions}
        activeSkyboxes={activeSkyboxes}
        setActiveSkyboxes={setActiveSkyboxes}
      />
    </div>
  );
};

export default Index;