import React, { useState, useRef } from 'react';
import StarMap from '../components/StarMap';
import ControlPanel from '../components/ControlPanel';
import { skyboxOptions } from '../data/starMapData';

const DrawConstellation = () => {
  const [showExoplanets, setShowExoplanets] = useState(false);
  const [showStarNames, setShowStarNames] = useState(false);
  const [activeSkyboxes, setActiveSkyboxes] = useState([
    skyboxOptions.find(option => option.label === 'Sky 1')
  ]);
  const starMapRef = useRef(null);

  return (
    <div className="h-screen relative">
      <StarMap
        ref={starMapRef}
        showExoplanets={showExoplanets}
        showStarNames={showStarNames}
        showConstellationLines={false}
        activeSkyboxes={activeSkyboxes}
        isPaintMode={true}
      />
      <ControlPanel
        showExoplanets={showExoplanets}
        setShowExoplanets={setShowExoplanets}
        showStarNames={showStarNames}
        setShowStarNames={setShowStarNames}
        skyboxOptions={skyboxOptions.filter(option => option.label === 'Sky 1')}
        activeSkyboxes={activeSkyboxes}
        setActiveSkyboxes={setActiveSkyboxes}
      />
    </div>
  );
};

export default DrawConstellation;