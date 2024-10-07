import React, { useState, useRef } from 'react';
import StarMap from '../components/StarMap';
import ControlPanel from '../components/ControlPanel';
import { skyboxOptions, exoplanets } from '../data/starMapData';

const Exoplanets = () => {
  const [showExoplanets, setShowExoplanets] = useState(true);
  const [selectedExoplanet, setSelectedExoplanet] = useState(null);
  const [activeSkyboxes, setActiveSkyboxes] = useState([skyboxOptions[0]]);
  const starMapRef = useRef(null);

  const handleExoplanetChange = (exoplanetName) => {
    const exoplanet = exoplanets.find(e => e.exoplanet_name === exoplanetName);
    setSelectedExoplanet(exoplanet);
    if (exoplanet && starMapRef.current) {
      starMapRef.current.navigateToExoplanet(exoplanet.exoplanet_name);
    }
  };

  const handleSkyboxToggle = (skybox, isChecked) => {
    if (isChecked) {
      setActiveSkyboxes(prev => [...prev, skybox]);
    } else {
      setActiveSkyboxes(prev => prev.filter(s => s.label !== skybox.label));
    }
  };

  return (
    <div className="h-screen relative">
      <StarMap
        ref={starMapRef}
        showExoplanets={showExoplanets}
        showStarNames={false}
        showConstellationLines={false}
        activeSkyboxes={activeSkyboxes}
      />
      <ControlPanel
        showExoplanets={showExoplanets}
        setShowExoplanets={setShowExoplanets}
        selectedExoplanet={selectedExoplanet}
        handleExoplanetChange={handleExoplanetChange}
        skyboxOptions={skyboxOptions}
        activeSkyboxes={activeSkyboxes}
        handleSkyboxToggle={handleSkyboxToggle}
        exoplanets={exoplanets}
      />
    </div>
  );
};

export default Exoplanets;