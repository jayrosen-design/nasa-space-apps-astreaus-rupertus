import React from 'react';
import StarMap from '../components/StarMap';

const Constellations = () => {
  return (
    <div className="h-screen">
      <StarMap
        showExoplanets={false}
        showStarNames={false}
        showConstellationLines={true}
      />
    </div>
  );
};

export default Constellations;