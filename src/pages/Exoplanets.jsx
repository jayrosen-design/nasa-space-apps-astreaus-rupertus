import React from 'react';
import StarMap from '../components/StarMap';

const Exoplanets = () => {
  return (
    <div className="h-screen">
      <StarMap
        showExoplanets={true}
        showStarNames={false}
        showConstellationLines={false}
      />
    </div>
  );
};

export default Exoplanets;