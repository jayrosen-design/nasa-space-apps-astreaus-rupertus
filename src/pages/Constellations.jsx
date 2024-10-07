import React, { useState, useRef } from 'react';
import StarMap from '../components/StarMap';
import ControlPanel from '../components/ControlPanel';
import { skyboxOptions, constellations, constellationStars } from '../data/starMapData';

const Constellations = () => {
  const [showExoplanets, setShowExoplanets] = useState(false);
  const [showStarNames, setShowStarNames] = useState(false);
  const [showConstellationLines, setShowConstellationLines] = useState(false);
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [selectedStar, setSelectedStar] = useState(null);
  const [activeSkyboxes, setActiveSkyboxes] = useState([
    skyboxOptions.find(option => option.label === 'Sky 1'),
    skyboxOptions.find(option => option.label === 'Constellations')
  ]);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const starMapRef = useRef(null);

  const handleConstellationChange = (constellationName) => {
    const constellation = constellations.find(c => c.name === constellationName);
    setSelectedConstellation(constellation);
    setSelectedStar(null);
    if (constellation && starMapRef.current) {
      starMapRef.current.navigateToCoordinates(constellation.coordinates);
    }
  };

  const handleConstellationStarChange = (starName) => {
    const star = constellationStars.find(s => s.star_name === starName);
    setSelectedStar(star);
    setSelectedConstellation(null);
    if (star && starMapRef.current) {
      starMapRef.current.navigateToStar(star.star_name);
    }
  };

  return (
    <div className="h-screen relative">
      {(selectedConstellation || selectedStar) && (
        <div className="absolute top-4 left-4 z-10 bg-background/80 p-4 rounded-lg shadow-lg max-w-md">
          {selectedConstellation && (
            <>
              <h2 className="text-4xl font-bold mb-2">{selectedConstellation.name}</h2>
              <p className="text-2xl mb-2">{selectedConstellation.stars} Stars</p>
              <p className="text-xl mb-2">{selectedConstellation.distance} Light Years Away</p>
              <p className="text-lg">{selectedConstellation.description}</p>
            </>
          )}
          {selectedStar && (
            <>
              <h2 className="text-4xl font-bold mb-2">{selectedStar.star_name}</h2>
              <p className="text-2xl mb-2">Constellation: {selectedStar.constellation}</p>
              <p className="text-xl mb-2">Right Ascension: {selectedStar.ra}°</p>
              <p className="text-xl mb-2">Declination: {selectedStar.dec}°</p>
              <p className="text-xl">Magnitude: {selectedStar.magnitude}</p>
            </>
          )}
        </div>
      )}
      <StarMap
        ref={starMapRef}
        showExoplanets={showExoplanets}
        showStarNames={showStarNames}
        showConstellationLines={showConstellationLines}
        activeSkyboxes={activeSkyboxes}
        isPaintMode={isPaintMode}
      />
      <ControlPanel
        showExoplanets={showExoplanets}
        setShowExoplanets={setShowExoplanets}
        showStarNames={showStarNames}
        setShowStarNames={setShowStarNames}
        showConstellationLines={showConstellationLines}
        setShowConstellationLines={setShowConstellationLines}
        selectedConstellation={selectedConstellation}
        selectedStar={selectedStar}
        skyboxOptions={skyboxOptions}
        activeSkyboxes={activeSkyboxes}
        setActiveSkyboxes={setActiveSkyboxes}
        constellations={constellations}
        constellationStars={constellationStars}
        onConstellationChange={handleConstellationChange}
        onConstellationStarChange={handleConstellationStarChange}
        isPaintMode={isPaintMode}
        setIsPaintMode={setIsPaintMode}
      />
    </div>
  );
};

export default Constellations;