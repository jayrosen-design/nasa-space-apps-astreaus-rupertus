import React, { useState, useRef } from 'react';
import StarMap from '../components/StarMap';
import ControlPanel from '../components/ControlPanel';
import { skyboxOptions } from '../data/starMapData';

const DrawConstellation = () => {
  const [activeSkyboxes, setActiveSkyboxes] = useState([
    skyboxOptions.find(option => option.label === 'Sky 1')
  ]);
  const starMapRef = useRef(null);

  return (
    <div className="h-screen relative">
      <StarMap
        ref={starMapRef}
        showExoplanets={false}
        showStarNames={false}
        showConstellationLines={false}
        activeSkyboxes={activeSkyboxes}
        isPaintMode={true}
        hideAllObjects={true}  // New prop to hide all 3D objects
      />
      <ControlPanel
        showExoplanets={false}
        setShowExoplanets={() => {}}
        showStarNames={false}
        setShowStarNames={() => {}}
        skyboxOptions={skyboxOptions.filter(option => option.label === 'Sky 1')}
        activeSkyboxes={activeSkyboxes}
        setActiveSkyboxes={setActiveSkyboxes}
      />
    </div>
  );
};

export default DrawConstellation;