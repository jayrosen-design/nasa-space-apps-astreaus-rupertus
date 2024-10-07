import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playClickSound } from '../utils/audio';

const ControlPanel = ({
  showStarNames,
  setShowStarNames,
  selectedConstellation,
  handleConstellationChange,
  selectedStar,
  handleConstellationStarChange,
  skyboxOptions,
  activeSkyboxes,
  handleSkyboxToggle,
  constellations,
  constellationStars,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background shadow p-4">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="show-star-names" 
            checked={showStarNames} 
            onCheckedChange={(value) => {
              playClickSound();
              setShowStarNames(value);
            }} 
          />
          <Label htmlFor="show-star-names">Show Star Names</Label>
        </div>

        <Select 
          onValueChange={handleConstellationChange} 
          value={selectedConstellation?.name || ''}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Constellation" />
          </SelectTrigger>
          <SelectContent>
            {constellations.map((constellation) => (
              <SelectItem key={constellation.name} value={constellation.name}>
                {constellation.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          onValueChange={handleConstellationStarChange} 
          value={selectedStar?.star_name || ''}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Star" />
          </SelectTrigger>
          <SelectContent>
            {constellationStars.map((star) => (
              <SelectItem key={star.star_name} value={star.star_name}>
                {star.star_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2">
          {skyboxOptions.map((option) => (
            <div key={option.label} className="flex items-center space-x-2">
              <Checkbox
                id={`skybox-${option.label}`}
                checked={activeSkyboxes.some(skybox => skybox.label === option.label)}
                onCheckedChange={(checked) => {
                  playClickSound();
                  handleSkyboxToggle(option, checked);
                }}
              />
              <Label htmlFor={`skybox-${option.label}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;