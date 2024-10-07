import React, { useState, useRef } from 'react';
import StarMap from '../components/StarMap';
import ControlPanel from '../components/ControlPanel';
import { skyboxOptions, constellations, constellationStars } from '../data/starMapData';

const Constellations = () => {
  const [showExoplanets, setShowExoplanets] = useState(false);
  const [showStarNames, setShowStarNames] = useState(false);
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [selectedStar, setSelectedStar] = useState(null);
  const [activeSkyboxes, setActiveSkyboxes] = useState([
    skyboxOptions.find(option => option.label === 'Sky 1'),
    skyboxOptions.find(option => option.label === 'Constellations')
  ]);
  const starMapRef = useRef(null);

  const handleConstellationChange = (constellationName) => {
    const constellation = constellations.find(c => c.name === constellationName);
    setSelectedConstellation(constellation);
    if (constellation && starMapRef.current) {
      starMapRef.current.navigateToCoordinates(constellation.coordinates);
    }
  };

  const handleConstellationStarChange = (starName) => {
    const star = constellationStars.find(s => s.star_name === starName);
    setSelectedStar(star);
    if (star && starMapRef.current) {
      starMapRef.current.navigateToStar(star.star_name);
    }
  };

  return (
    <div className="h-screen relative">
      <StarMap
        ref={starMapRef}
        showExoplanets={showExoplanets}
        showStarNames={showStarNames}
        showConstellationLines={false}
        activeSkyboxes={activeSkyboxes}
      />
      <ControlPanel
        showExoplanets={showExoplanets}
        setShowExoplanets={setShowExoplanets}
        showStarNames={showStarNames}
        setShowStarNames={setShowStarNames}
        selectedConstellation={selectedConstellation}
        selectedStar={selectedStar}
        skyboxOptions={skyboxOptions}
        activeSkyboxes={activeSkyboxes}
        setActiveSkyboxes={setActiveSkyboxes}
        constellations={constellations}
        constellationStars={constellationStars}
        onConstellationChange={handleConstellationChange}
        onConstellationStarChange={handleConstellationStarChange}
      />
    </div>
  );
};

export default Constellations;