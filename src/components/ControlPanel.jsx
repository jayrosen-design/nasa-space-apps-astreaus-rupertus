import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const renderCheckbox = (id, checked, onChange, label) => (
  <div className="flex items-center space-x-2">
    <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
    <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {label}
    </label>
  </div>
);

const renderSelect = (onValueChange, value, placeholder, options, valueKey, labelKey) => (
  <div className="flex flex-col space-y-1">
    <Label>{placeholder}</Label>
    <Select onValueChange={onValueChange} value={value || ''}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option[valueKey]} value={option[valueKey]}>
            {option[labelKey]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const ControlPanel = ({
  coordinates,
  handleInputChange,
  handleSubmit,
  autoplay,
  setAutoplay,
  theme,
  setTheme,
  handleConstellationChange,
  zoom,
  handleZoomChange,
  handleExoplanetChange,
  skyboxOptions,
  constellations,
  zoomOptions,
  exoplanets,
  showExoplanets,
  setShowExoplanets,
  selectedConstellation,
  handleConstellationStarChange,
  showStarNames,
  setShowStarNames,
  showConstellationLines,
  setShowConstellationLines,
  selectedExoplanet,
  selectedStar,
  constellationStars,
  activeSkyboxes,
  handleSkyboxToggle,
}) => (
  <div className="absolute bottom-0 left-0 right-0 bg-background p-4 shadow">
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 items-center">
      <div className="flex space-x-2 justify-center">
        {['x', 'y', 'z'].map((axis) => (
          <Input
            key={axis}
            type="number"
            name={axis}
            value={coordinates[axis]}
            onChange={handleInputChange}
            placeholder={axis.toUpperCase()}
            className="w-20"
          />
        ))}
        <Button type="submit">Navigate</Button>
      </div>
      
      <div className="flex items-center space-x-4 flex-wrap">
        {renderCheckbox("autoplay", autoplay, setAutoplay, "Autoplay")}
        <div className="flex items-center space-x-2">
          <Switch
            id="dark-mode"
            checked={theme === 'dark'}
            onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <label htmlFor="dark-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Dark Mode
          </label>
        </div>
        {renderCheckbox("show-exoplanets", showExoplanets, setShowExoplanets, "Show Exoplanets")}
        {renderCheckbox("show-star-names", showStarNames, setShowStarNames, "Show Star Names")}
        {renderCheckbox("show-constellation-lines", showConstellationLines, setShowConstellationLines, "Show Constellation Lines")}
      </div>
      
      <div className="flex items-center space-x-2 flex-wrap">
        {renderSelect(handleConstellationChange, selectedConstellation?.name, "Select Constellation", constellations, "name", "name")}
        {renderSelect(handleZoomChange, zoom.toString(), "Select Zoom", zoomOptions, "value", "label")}
        {renderSelect(handleExoplanetChange, selectedExoplanet?.exoplanet_name, "Select Exoplanet", exoplanets, "exoplanet_name", "exoplanet_name")}
        {renderSelect(
          handleConstellationStarChange,
          selectedStar?.star_name,
          "Select Constellation Star",
          constellationStars,
          "star_name",
          "star_name"
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <Label>Skybox Layers</Label>
        <div className="flex flex-wrap gap-2">
          {skyboxOptions.map((option) => (
            <div key={option.label} className="flex items-center space-x-2">
              <Checkbox
                id={`skybox-${option.label}`}
                checked={activeSkyboxes.some(skybox => skybox.label === option.label)}
                onCheckedChange={(checked) => handleSkyboxToggle(option, checked)}
              />
              <label htmlFor={`skybox-${option.label}`} className="text-sm">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </form>
  </div>
);

export default ControlPanel;
