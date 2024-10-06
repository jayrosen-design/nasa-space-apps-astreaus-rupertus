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
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-background p-4 shadow">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 items-center">
        <div className="flex space-x-2 justify-center">
          <Input
            type="number"
            name="x"
            value={coordinates.x}
            onChange={handleInputChange}
            placeholder="X"
            className="w-20"
          />
          <Input
            type="number"
            name="y"
            value={coordinates.y}
            onChange={handleInputChange}
            placeholder="Y"
            className="w-20"
          />
          <Input
            type="number"
            name="z"
            value={coordinates.z}
            onChange={handleInputChange}
            placeholder="Z"
            className="w-20"
          />
          <Button type="submit">Navigate</Button>
        </div>
        <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoplay"
              checked={autoplay}
              onCheckedChange={setAutoplay}
            />
            <label
              htmlFor="autoplay"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Autoplay
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
            <label
              htmlFor="dark-mode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Dark Mode
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-exoplanets"
              checked={showExoplanets}
              onCheckedChange={setShowExoplanets}
            />
            <label
              htmlFor="show-exoplanets"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show Exoplanets
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-star-names"
              checked={showStarNames}
              onCheckedChange={setShowStarNames}
            />
            <label
              htmlFor="show-star-names"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show Star Names
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-constellation-lines"
              checked={showConstellationLines}
              onCheckedChange={setShowConstellationLines}
            />
            <label
              htmlFor="show-constellation-lines"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show Constellation Lines
            </label>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select onValueChange={handleSkyboxChange} defaultValue={skyboxUrl}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Skybox" />
            </SelectTrigger>
            <SelectContent>
              {skyboxOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleConstellationChange}>
            <SelectTrigger className="w-[180px]">
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
          <Select onValueChange={handleZoomChange} defaultValue={zoom}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Zoom" />
            </SelectTrigger>
            <SelectContent>
              {zoomOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleExoplanetChange}>
            <SelectTrigger className="w-[180px]">
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
          <Select onValueChange={handleConstellationStarChange} value={selectedConstellation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Constellation Star" />
            </SelectTrigger>
            <SelectContent>
              {constellations.map((constellation) => (
                <SelectItem key={constellation.name} value={constellation.name}>
                  {constellation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      </form>
    </div>
  );
};

export default ControlPanel;
