import React, { useState, useRef } from 'react';
import StarMap from '../components/StarMap';
import ControlPanel from '../components/ControlPanel';
import { skyboxOptions, constellations, constellationStars } from '../data/starMapData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Constellations = () => {
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
        showExoplanets={false}
        showStarNames={showStarNames}
        showConstellationLines={true}
        activeSkyboxes={activeSkyboxes}
      />
      <div className="absolute top-4 left-4 z-10 bg-background/80 p-4 rounded space-y-4">
        <Select onValueChange={handleConstellationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a constellation" />
          </SelectTrigger>
          <SelectContent>
            {constellations.map((constellation) => (
              <SelectItem key={constellation.name} value={constellation.name}>
                {constellation.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={handleConstellationStarChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a star" />
          </SelectTrigger>
          <SelectContent>
            {constellationStars.map((star) => (
              <SelectItem key={star.star_name} value={star.star_name}>
                {star.star_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ControlPanel
        showStarNames={showStarNames}
        setShowStarNames={setShowStarNames}
        selectedConstellation={selectedConstellation}
        selectedStar={selectedStar}
        skyboxOptions={skyboxOptions}
        activeSkyboxes={activeSkyboxes}
        setActiveSkyboxes={setActiveSkyboxes}
      />
    </div>
  );
};

export default Constellations;