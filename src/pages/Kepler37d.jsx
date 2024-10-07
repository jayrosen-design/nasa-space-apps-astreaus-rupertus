import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarMap from '../components/StarMap';
import ControlPanel from '../components/ControlPanel';
import { skyboxOptions } from '../data/starMapData';

const Kepler37d = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [activeSkyboxes, setActiveSkyboxes] = useState([skyboxOptions.find(option => option.label === 'Kepler-37d')]);
  const starMapRef = useRef(null);
  const navigate = useNavigate();

  const handleObjectClick = (object) => {
    setSelectedObject(object);
    if (object.name === 'Kepler-37d') {
      navigate('/exospace');
    }
  };

  useEffect(() => {
    if (starMapRef.current) {
      starMapRef.current.navigateToExoplanet('Kepler-37d');
    }
  }, []);

  return (
    <div className="relative h-screen bg-background text-foreground">
      <div className="absolute top-4 left-4 z-10 bg-background/80 p-2 rounded">
        <h1 className="text-2xl font-bold">Kepler-37d</h1>
      </div>
      <StarMap 
        ref={starMapRef} 
        showExoplanets={true}
        showStarNames={false}
        showConstellationLines={false}
        onObjectClick={handleObjectClick}
        activeSkyboxes={activeSkyboxes}
        initialObjects={[
          { name: 'Kepler-37d', type: 'exoplanet', color: 'orange', size: 15 },
        ]}
      />
      <ControlPanel
        showExoplanets={true}
        setShowExoplanets={() => {}}
        showStarNames={false}
        setShowStarNames={() => {}}
        showConstellationLines={false}
        setShowConstellationLines={() => {}}
        selectedObject={selectedObject}
        skyboxOptions={skyboxOptions}
        activeSkyboxes={activeSkyboxes}
        setActiveSkyboxes={setActiveSkyboxes}
      />
    </div>
  );
};

export default Kepler37d;