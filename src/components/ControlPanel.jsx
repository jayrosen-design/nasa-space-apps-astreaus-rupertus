import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Menu } from 'lucide-react';
import { playClickSound } from '../utils/audio';

const renderCheckbox = (id, checked, onChange, label) => (
  <div className="flex items-center space-x-2">
    <Checkbox 
      id={id} 
      checked={checked} 
      onCheckedChange={(value) => {
        playClickSound();
        onChange(value);
      }} 
    />
    <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {label}
    </label>
  </div>
);

const renderSelect = (onValueChange, value, placeholder, options, valueKey, labelKey) => (
  <div className="flex flex-col space-y-1">
    <Label>{placeholder}</Label>
    <Select 
      onValueChange={(newValue) => {
        playClickSound();
        onValueChange(newValue);
      }} 
      value={value || ''}
    >
      <SelectTrigger className="w-full">
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
  handleExoplanetChange,
  skyboxOptions,
  constellations,
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
  isVisible,
  toggleVisibility,
  isBackgroundMusicPlaying,
  setIsBackgroundMusicPlaying,
  isDrawMode,
  setIsDrawMode,
  handleSaveImage,
  handleGoToKepler37d,
}) => (
  <div className={`fixed bottom-0 left-0 right-0 bg-background shadow transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
    <Button
      className="absolute -top-10 left-4 p-2"
      variant="outline"
      onClick={() => {
        playClickSound();
        toggleVisibility();
      }}
      aria-label="Toggle control panel"
    >
      <Menu className="h-6 w-6" />
    </Button>
    <div className="p-4">
      <form onSubmit={(e) => {
        e.preventDefault();
        playClickSound();
        handleSubmit(e);
      }} className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-2 justify-center">
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
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {renderCheckbox("autoplay", autoplay, setAutoplay, "Autoplay")}
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={() => {
                playClickSound();
                setTheme(theme === 'dark' ? 'light' : 'dark');
              }}
            />
            <label htmlFor="dark-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Dark Mode
            </label>
          </div>
          {renderCheckbox("show-exoplanets", showExoplanets, setShowExoplanets, "Show Exoplanets")}
          {renderCheckbox("show-star-names", showStarNames, setShowStarNames, "Show Star Names")}
          {renderCheckbox("show-constellation-lines", showConstellationLines, setShowConstellationLines, "Show Constellation Lines")}
          <div className="flex items-center space-x-2">
            <Switch
              id="background-music"
              checked={isBackgroundMusicPlaying}
              onCheckedChange={(checked) => {
                playClickSound();
                setIsBackgroundMusicPlaying(checked);
              }}
            />
            <label htmlFor="background-music" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Background Music
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {renderSelect(handleConstellationChange, selectedConstellation?.name, "Select Constellation", constellations, "name", "name")}
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

        <div className="flex flex-col space-y-2">
          <Label>Skybox Layers</Label>
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
                <label htmlFor={`skybox-${option.label}`} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </form>
      <div className="flex justify-center space-x-4 mt-4">
        <Button
          onClick={() => {
            playClickSound();
            setIsDrawMode(!isDrawMode);
          }}
          variant={isDrawMode ? "secondary" : "outline"}
        >
          {isDrawMode ? "Stop Drawing" : "Draw Constellation"}
        </Button>
        <Button
          onClick={() => {
            playClickSound();
            handleSaveImage();
          }}
        >
          Save Image
        </Button>
        <Button
          onClick={() => {
            playClickSound();
            handleGoToKepler37d();
          }}
        >
          Go to Kepler-37d
        </Button>
      </div>
    </div>
  </div>
);

export default ControlPanel;