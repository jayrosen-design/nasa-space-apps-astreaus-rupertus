import React, { useState, useRef, useEffect } from 'react';
import StarMap from '../components/StarMap';
import { constellations, exoplanets, skyboxOptions, constellationStars } from '../data/starMapData';
import { useTheme } from 'next-themes';
import { playBackgroundMusic, stopBackgroundMusic } from '../utils/audio';

const Index = () => {
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

  useEffect(() => {
    if (isBackgroundMusicPlaying) {
      playBackgroundMusic();
    } else {
      stopBackgroundMusic();
    }
  }, [isBackgroundMusicPlaying]);

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

  return (
    <div className="relative h-screen bg-background text-foreground">
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
      />
    </div>
  );
};

export default Index;