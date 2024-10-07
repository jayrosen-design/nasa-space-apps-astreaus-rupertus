import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { playClickSound } from '../utils/audio';

const ControlPanel = ({
  showExoplanets,
  setShowExoplanets,
  selectedExoplanet,
  handleExoplanetChange,
  skyboxOptions,
  activeSkyboxes,
  handleSkyboxToggle,
  exoplanets,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background shadow p-4">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="show-exoplanets" 
            checked={showExoplanets} 
            onCheckedChange={(value) => {
              playClickSound();
              setShowExoplanets(value);
            }} 
          />
          <Label htmlFor="show-exoplanets">Show Exoplanets</Label>
        </div>

        {exoplanets && exoplanets.length > 0 && (
          <Select 
            onValueChange={handleExoplanetChange} 
            value={selectedExoplanet?.exoplanet_name || ''}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Exoplanet" />
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
        )}
      </div>
    </div>
  );
};

export default ControlPanel;