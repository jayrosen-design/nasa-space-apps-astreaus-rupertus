import React, { useState, useRef, useEffect } from 'react';
import StarMap from '../components/StarMap';
import ControlPanel from '../components/ControlPanel';
import { skyboxOptions, constellations, constellationStars, exoplanets } from '../data/starMapData';

const Constellations = () => {
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [selectedStar, setSelectedStar] = useState(null);
  const [selectedExoplanet, setSelectedExoplanet] = useState(null);
  const [activeSkyboxes, setActiveSkyboxes] = useState([
    skyboxOptions.find(option => option.label === 'Sky 1'),
    skyboxOptions.find(option => option.label === 'Constellations')
  ]);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const starMapRef = useRef(null);

  useEffect(() => {
    // Automatically select Kepler-37d when the component mounts
    const kepler37d = exoplanets.find(e => e.exoplanet_name === 'Kepler-37d');
    if (kepler37d) {
      setSelectedExoplanet(kepler37d);
      if (starMapRef.current) {
        starMapRef.current.navigateToExoplanet('Kepler-37d');
      }
    }
  }, []);

  const handleConstellationChange = (constellationName) => {
    const constellation = constellations.find(c => c.name === constellationName);
    setSelectedConstellation(constellation);
    setSelectedStar(null);
    setSelectedExoplanet(null);
    if (constellation && starMapRef.current) {
      starMapRef.current.navigateToCoordinates(constellation.coordinates);
    }
  };

  const handleConstellationStarChange = (starName) => {
    const star = constellationStars.find(s => s.star_name === starName);
    setSelectedStar(star);
    setSelectedConstellation(null);
    setSelectedExoplanet(null);
    if (star && starMapRef.current) {
      starMapRef.current.navigateToStar(star.star_name);
    }
  };

  const handleExoplanetChange = (exoplanetName) => {
    const exoplanet = exoplanets.find(e => e.exoplanet_name === exoplanetName);
    setSelectedExoplanet(exoplanet);
    setSelectedConstellation(null);
    setSelectedStar(null);
    if (exoplanet && starMapRef.current) {
      starMapRef.current.navigateToExoplanet(exoplanet.exoplanet_name);
    }
  };

  return (
    <div className="h-screen relative">
      {(selectedConstellation || selectedStar || selectedExoplanet) && (
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
          {selectedExoplanet && (
            <>
              <h2 className="text-4xl font-bold mb-2">{selectedExoplanet.exoplanet_name}</h2>
              <p className="text-2xl mb-2">Host Star: {selectedExoplanet.host_star}</p>
              <p className="text-xl mb-2">Distance: {selectedExoplanet.distance_light_years} Light Years</p>
              <p className="text-xl">Planet Type: {selectedExoplanet.planet_type}</p>
            </>
          )}
        </div>
      )}
      <StarMap
        ref={starMapRef}
        showExoplanets={true}
        showStarNames={false}
        showConstellationLines={false}
        activeSkyboxes={activeSkyboxes}
        isPaintMode={isPaintMode}
      />
      <ControlPanel
        selectedConstellation={selectedConstellation}
        selectedStar={selectedStar}
        selectedExoplanet={selectedExoplanet}
        skyboxOptions={skyboxOptions}
        activeSkyboxes={activeSkyboxes}
        setActiveSkyboxes={setActiveSkyboxes}
        constellations={constellations}
        constellationStars={constellationStars}
        exoplanets={exoplanets}
        onConstellationChange={handleConstellationChange}
        onConstellationStarChange={handleConstellationStarChange}
        onExoplanetChange={handleExoplanetChange}
        isPaintMode={isPaintMode}
        setIsPaintMode={setIsPaintMode}
      />
    </div>
  );
};

export default Constellations;
