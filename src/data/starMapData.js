export const constellations = [
  { name: 'Orion', coordinates: { x: 83.82, y: 5.39, z: -2.42 }, stars: 7, distance: 1344 },
  { name: 'Ursa Major', coordinates: { x: 165.46, y: 61.75, z: -8.93 }, stars: 7, distance: 80 },
  { name: 'Cassiopeia', coordinates: { x: 10.68, y: 59.15, z: 2.36 }, stars: 5, distance: 228 },
  { name: 'Leo', coordinates: { x: 177.47, y: 14.47, z: -10.76 }, stars: 9, distance: 77 },
  { name: 'Scorpius', coordinates: { x: 247.36, y: -26.43, z: -4.22 }, stars: 18, distance: 604 },
  { name: 'Taurus', coordinates: { x: 66.57, y: 16.51, z: -3.74 }, stars: 19, distance: 65 },
  { name: 'Gemini', coordinates: { x: 113.65, y: 28.03, z: -8.11 }, stars: 17, distance: 52 },
  { name: 'Cygnus', coordinates: { x: 305.56, y: 40.73, z: 4.22 }, stars: 9, distance: 1400 },
  { name: 'Canis Major', coordinates: { x: 101.28, y: -16.71, z: -5.13 }, stars: 8, distance: 8.6 },
  { name: 'Lyra', coordinates: { x: 284.74, y: 32.69, z: 4.48 }, stars: 5, distance: 25 },
  { name: 'Aquila', coordinates: { x: 297.69, y: 8.87, z: 3.71 }, stars: 10, distance: 17 },
  { name: 'Pegasus', coordinates: { x: 344.41, y: 15.21, z: 3.51 }, stars: 9, distance: 133 },
];

export const zoomOptions = [
  { label: '10mm', value: 10 },
  { label: '12mm', value: 12 },
  { label: '16mm', value: 16 },
  { label: '35mm', value: 35 },
  { label: '55mm', value: 55 },
  { label: '100mm', value: 100 },
  { label: '135mm', value: 135 },
  { label: '250mm', value: 250 },
  { label: '350mm', value: 350 },
  { label: '500mm', value: 500 },
];

export const exoplanets = [
  { exoplanet_name: 'Proxima Centauri b', host_star: 'Proxima Centauri', distance_light_years: 4.24, planet_type: 'Rocky' },
  { exoplanet_name: 'TRAPPIST-1e', host_star: 'TRAPPIST-1', distance_light_years: 39.5, planet_type: 'Rocky' },
  // ... add the rest of the exoplanets data here
];

export const skyboxOptions = [
  { label: 'Galaxy Texture', value: 'https://i.imgur.com/VhVRrHk.jpeg' },
  { label: 'Space', value: 'https://imgur.com/VhVRrHk.jpg' },
];
