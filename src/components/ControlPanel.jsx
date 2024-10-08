import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { playClickSound } from '../utils/audio';

const ControlPanel = ({
  selectedObject,
  selectedObjectType,
  skyboxOptions,
  activeSkyboxes,
  setActiveSkyboxes,
  constellations,
  constellationStars,
  onConstellationChange,
  onConstellationStarChange,
  exoplanets,
  onExoplanetChange,
}) => {
  const handleSkyboxToggle = (skybox) => {
    playClickSound();
    setActiveSkyboxes(prev => 
      prev.some(s => s.label === skybox.label)
        ? prev.filter(s => s.label !== skybox.label)
        : [...prev, skybox]
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background shadow p-4">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        {constellations && (
          <Select onValueChange={onConstellationChange}>
            <SelectTrigger className="w-[200px]">
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
        )}

        {constellationStars && (
          <Select onValueChange={onConstellationStarChange}>
            <SelectTrigger className="w-[200px]">
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
        )}

        {exoplanets && (
          <Select onValueChange={onExoplanetChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select an exoplanet" />
            </SelectTrigger>
            <SelectContent>
              {exoplanets.map((exoplanet) => (
                <SelectItem key={exoplanet.exoplanet_name} value={exoplanet.exoplanet_name}>
                  {exoplanet.exoplanet_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {skyboxOptions && skyboxOptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skyboxOptions.filter(option => option.label !== 'Paint Constellation Mode' && option.label !== 'Sky 2').map((option) => (
              <div key={option.label} className="flex items-center space-x-2">
                <Checkbox
                  id={`skybox-${option.label}`}
                  checked={activeSkyboxes.some(skybox => skybox.label === option.label)}
                  onCheckedChange={() => handleSkyboxToggle(option)}
                />
                <Label htmlFor={`skybox-${option.label}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;