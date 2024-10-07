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
        showExoplanets={false}
        showStarNames={false}
        showConstellationLines={false}
        onObjectClick={handleObjectClick}
        autoplay={autoplay}
        activeSkyboxes={activeSkyboxes}
        initialObjects={[
          { name: 'Kepler-37d', type: 'exoplanet', color: 'orange', size: 5 },
          { name: 'Aldebaran', type: 'star', color: 'red', size: 8 }
        ]}
      />
      <ControlPanel
        showExoplanets={false}
        setShowExoplanets={() => {}}
        showStarNames={false}
        setShowStarNames={() => {}}
        showConstellationLines={false}
        setShowConstellationLines={() => {}}
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