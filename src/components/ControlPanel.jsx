import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const ControlPanel = ({
  coordinates,
  handleInputChange,
  handleSubmit,
  autoplay,
  setAutoplay,
  theme,
  setTheme,
  skyboxUrl,
  handleSkyboxChange,
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
}) => {
  const renderCheckbox = (id, checked, onChange, label) => (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    </div>
  );

  const renderSelect = (onValueChange, defaultValue, placeholder, options, valueKey, labelKey) => (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
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
  );

  return (
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
          {renderSelect(handleSkyboxChange, skyboxUrl, "Select Skybox", skyboxOptions, "value", "label")}
          {renderSelect(handleConstellationChange, null, "Select Constellation", constellations, "name", "name")}
          {renderSelect(handleZoomChange, zoom, "Select Zoom", zoomOptions, "value", "label")}
          {renderSelect(handleExoplanetChange, null, "Select Exoplanet", exoplanets, "exoplanet_name", "exoplanet_name")}
          {renderSelect(handleConstellationStarChange, selectedConstellation, "Select Constellation Star", constellations, "name", "name")}
        </div>
      </form>
    </div>
  );
};

export default ControlPanel;