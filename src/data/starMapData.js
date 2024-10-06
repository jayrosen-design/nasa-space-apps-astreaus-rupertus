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
  { exoplanet_name: 'Kepler-186f', host_star: 'Kepler-186', distance_light_years: 582, planet_type: 'Rocky' },
  { exoplanet_name: 'HD 219134 b', host_star: 'HD 219134', distance_light_years: 21, planet_type: 'Rocky' },
  { exoplanet_name: 'Kepler-442b', host_star: 'Kepler-442', distance_light_years: 1206, planet_type: 'Rocky' },
  { exoplanet_name: 'Wolf 1061c', host_star: 'Wolf 1061', distance_light_years: 13.8, planet_type: 'Rocky' },
  { exoplanet_name: 'Kepler-22b', host_star: 'Kepler-22', distance_light_years: 638, planet_type: 'Super-Earth/Mini-Neptune' },
  { exoplanet_name: 'Kepler-452b', host_star: 'Kepler-452', distance_light_years: 1402, planet_type: 'Super-Earth' },
  { exoplanet_name: 'Tau Ceti e', host_star: 'Tau Ceti', distance_light_years: 11.9, planet_type: 'Super-Earth' },
  { exoplanet_name: 'Gliese 667 Cc', host_star: 'Gliese 667 C', distance_light_years: 23.62, planet_type: 'Super-Earth' },
  { exoplanet_name: 'HD 40307 g', host_star: 'HD 40307', distance_light_years: 42, planet_type: 'Super-Earth' },
  { exoplanet_name: 'Kepler-62f', host_star: 'Kepler-62', distance_light_years: 1200, planet_type: 'Super-Earth' },
  { exoplanet_name: 'Kepler-1649c', host_star: 'Kepler-1649', distance_light_years: 301, planet_type: 'Rocky' },
  { exoplanet_name: 'TOI 700 d', host_star: 'TOI 700', distance_light_years: 101.4, planet_type: 'Rocky' },
  { exoplanet_name: 'K2-18b', host_star: 'K2-18', distance_light_years: 124, planet_type: 'Super-Earth' },
];

export const skyboxOptions = [
  { label: 'Galaxy Texture', value: 'https://i.imgur.com/VhVRrHk.jpeg' },
  { label: 'Space', value: 'https://imgur.com/VhVRrHk.jpg' },
];

export const constellationStars = [
  { star_name: 'Sirius', constellation: 'Canis Major', ra: 101.287, dec: 16.716, magnitude: -1.46 },
  { star_name: 'Canopus', constellation: 'Carina', ra: 95.987, dec: -52.695, magnitude: -0.72 },
  { star_name: 'Rigil Kentaurus', constellation: 'Centaurus', ra: 219.900, dec: -60.835, magnitude: -0.27 },
  { star_name: 'Arcturus', constellation: 'Boötes', ra: 213.915, dec: 19.182, magnitude: -0.05 },
  { star_name: 'Vega', constellation: 'Lyra', ra: 279.234, dec: 38.784, magnitude: 0.03 },
  { star_name: 'Capella', constellation: 'Auriga', ra: 79.172, dec: 45.998, magnitude: 0.08 },
  { star_name: 'Rigel', constellation: 'Orion', ra: 78.634, dec: -8.201, magnitude: 0.18 },
  { star_name: 'Procyon', constellation: 'Canis Minor', ra: 114.825, dec: 5.224, magnitude: 0.34 },
  { star_name: 'Achernar', constellation: 'Eridanus', ra: 24.428, dec: -57.236, magnitude: 0.46 },
  { star_name: 'Betelgeuse', constellation: 'Orion', ra: 88.793, dec: 7.407, magnitude: 0.50 },
  { star_name: 'Hadar', constellation: 'Centaurus', ra: 210.955, dec: -60.373, magnitude: 0.61 },
  { star_name: 'Altair', constellation: 'Aquila', ra: 297.695, dec: 8.868, magnitude: 0.77 },
  { star_name: 'Acrux', constellation: 'Crux', ra: 186.649, dec: -63.099, magnitude: 0.77 },
  { star_name: 'Aldebaran', constellation: 'Taurus', ra: 68.980, dec: 16.509, magnitude: 0.85 },
  { star_name: 'Antares', constellation: 'Scorpius', ra: 247.351, dec: -26.432, magnitude: 1.06 },
  { star_name: 'Spica', constellation: 'Virgo', ra: 201.298, dec: -11.161, magnitude: 1.04 },
  { star_name: 'Pollux', constellation: 'Gemini', ra: 116.329, dec: 28.026, magnitude: 1.14 },
  { star_name: 'Fomalhaut', constellation: 'Piscis Austrinus', ra: 344.412, dec: -29.622, magnitude: 1.16 },
  { star_name: 'Deneb', constellation: 'Cygnus', ra: 310.357, dec: 45.280, magnitude: 1.25 },
  { star_name: 'Mimosa', constellation: 'Crux', ra: 191.930, dec: -59.688, magnitude: 1.25 },
  { star_name: 'Regulus', constellation: 'Leo', ra: 152.093, dec: 11.967, magnitude: 1.35 },
  { star_name: 'Adhara', constellation: 'Canis Major', ra: 104.656, dec: -28.972, magnitude: 1.50 },
  { star_name: 'Castor', constellation: 'Gemini', ra: 113.649, dec: 31.888, magnitude: 1.58 },
  { star_name: 'Shaula', constellation: 'Scorpius', ra: 263.402, dec: -37.103, magnitude: 1.62 },
  { star_name: 'Bellatrix', constellation: 'Orion', ra: 81.283, dec: 6.350, magnitude: 1.64 },
  { star_name: 'Elnath', constellation: 'Taurus', ra: 81.572, dec: 28.607, magnitude: 1.65 },
  { star_name: 'Miaplacidus', constellation: 'Carina', ra: 147.269, dec: -69.028, magnitude: 1.67 },
  { star_name: 'Alnilam', constellation: 'Orion', ra: 84.053, dec: -1.201, magnitude: 1.69 },
  { star_name: 'Alnair', constellation: 'Grus', ra: 332.058, dec: -46.961, magnitude: 1.73 },
  { star_name: 'Alphard', constellation: 'Hydra', ra: 141.896, dec: -8.658, magnitude: 1.98 },
  { star_name: 'Alnitak', constellation: 'Orion', ra: 85.189, dec: -1.942, magnitude: 1.74 },
  { star_name: 'Dubhe', constellation: 'Ursa Major', ra: 165.461, dec: 61.751, magnitude: 1.79 },
  { star_name: 'Mirfak', constellation: 'Perseus', ra: 51.080, dec: 49.861, magnitude: 1.79 },
  { star_name: 'Wezen', constellation: 'Canis Major', ra: 106.024, dec: -26.394, magnitude: 1.83 },
  { star_name: 'Sargas', constellation: 'Scorpius', ra: 263.733, dec: -42.999, magnitude: 1.86 },
  { star_name: 'Kaus Australis', constellation: 'Sagittarius', ra: 283.816, dec: -34.384, magnitude: 1.79 },
  { star_name: 'Avior', constellation: 'Carina', ra: 135.623, dec: -59.508, magnitude: 1.86 },
  { star_name: 'Alkaid', constellation: 'Ursa Major', ra: 206.885, dec: 49.313, magnitude: 1.86 },
  { star_name: 'Menkalinan', constellation: 'Auriga', ra: 81.572, dec: 44.947, magnitude: 1.90 },
  { star_name: 'Atria', constellation: 'Triangulum Australe', ra: 252.166, dec: -69.027, magnitude: 1.91 },
  { star_name: 'Alhena', constellation: 'Gemini', ra: 99.427, dec: 16.399, magnitude: 1.92 },
  { star_name: 'Peacock', constellation: 'Pavo', ra: 306.412, dec: -56.735, magnitude: 1.94 },
  { star_name: 'Alsephina', constellation: 'Canis Major', ra: 107.187, dec: -26.393, magnitude: 1.97 },
  { star_name: 'Mirzam', constellation: 'Canis Major', ra: 95.675, dec: -17.955, magnitude: 1.98 },
  { star_name: 'Alpherg', constellation: 'Pisces', ra: 349.291, dec: 1.254, magnitude: 1.96 },
  { star_name: 'Muhlifain', constellation: 'Centaurus', ra: 193.906, dec: -60.374, magnitude: 1.91 },
  { star_name: 'Zubeneschamali', constellation: 'Libra', ra: 229.251, dec: -9.383, magnitude: 2.61 },
  { star_name: 'Gacrux', constellation: 'Crux', ra: 187.791, dec: -57.113, magnitude: 1.63 },
  { star_name: 'Denebola', constellation: 'Leo', ra: 177.264, dec: 14.571, magnitude: 2.14 },
  { star_name: 'Aspidiske', constellation: 'Carina', ra: 153.434, dec: -70.038, magnitude: 2.21 },
  { star_name: 'Algorab', constellation: 'Corvus', ra: 187.466, dec: -16.515, magnitude: 2.94 },
  { star_name: 'Markab', constellation: 'Pegasus', ra: 344.412, dec: 15.205, magnitude: 2.49 },
  { star_name: 'Alhajoth', constellation: 'Cepheus', ra: 342.354, dec: 59.157, magnitude: 3.21 },
  { star_name: 'Vindemiatrix', constellation: 'Virgo', ra: 200.981, dec: 13.243, magnitude: 2.85 },
  { star_name: 'Sadr', constellation: 'Cygnus', ra: 305.556, dec: 40.256, magnitude: 2.23 },
  { star_name: 'Aldhibain', constellation: 'Cassiopeia', ra: 349.291, dec: 50.805, magnitude: 2.68 },
  { star_name: 'Arided', constellation: 'Piscis Austrinus', ra: 352.522, dec: -36.566, magnitude: 2.38 },
  { star_name: 'Hamal', constellation: 'Aries', ra: 31.792, dec: 23.462, magnitude: 2.00 },
  { star_name: 'Menkar', constellation: 'Cetus', ra: 44.030, dec: 4.089, magnitude: 2.54 },
  { star_name: 'Thuban', constellation: 'Draco', ra: 219.903, dec: 64.374, magnitude: 3.67 },
  { star_name: 'Ankaa', constellation: 'Phoenix', ra: 6.570, dec: -42.306, magnitude: 2.39 },
  { star_name: 'Rasalhague', constellation: 'Ophiuchus', ra: 263.733, dec: 12.560, magnitude: 2.07 },
  { star_name: 'Caph', constellation: 'Cassiopeia', ra: 2.293, dec: 59.149, magnitude: 2.28 },
  { star_name: 'Marfik', constellation: 'Ophiuchus', ra: 263.402, dec: -12.244, magnitude: 3.03 },
  { star_name: 'Almach', constellation: 'Andromeda', ra: 30.974, dec: 42.329, magnitude: 2.10 },
  { star_name: 'Epsilon Indi', constellation: 'Indus', ra: 317.070, dec: -57.236, magnitude: 4.69 },
  { star_name: 'Sadalmelik', constellation: 'Aquarius', ra: 316.233, dec: -0.319, magnitude: 2.94 },
  { star_name: 'Unukalhai', constellation: 'Serpens', ra: 233.671, dec: 6.424, magnitude: 2.63 },
  { star_name: 'Rasalgethi', constellation: 'Hercules', ra: 263.054, dec: 14.390, magnitude: 3.48 },
  { star_name: 'Mebsuta', constellation: 'Gemini', ra: 99.796, dec: 25.143, magnitude: 2.87 },
  { star_name: 'Cursa', constellation: 'Eridanus', ra: 84.053, dec: 5.232, magnitude: 2.79 },
  { star_name: 'Tureis', constellation: 'Carina', ra: 130.025, dec: -59.821, magnitude: 2.79 },
  { star_name: 'Scheat', constellation: 'Pegasus', ra: 344.412, dec: 28.026, magnitude: 2.42 },
  { star_name: 'Bellatrix', constellation: 'Orion', ra: 88.793, dec: 9.647, magnitude: 1.62 },
  { star_name: 'Ruchbah', constellation: 'Cassiopeia', ra: 12.012, dec: 60.719, magnitude: 2.68 },
  { star_name: 'Zaurak', constellation: 'Eridanus', ra: 70.381, dec: -7.108, magnitude: 2.95 },
  { star_name: 'Achird', constellation: 'Cassiopeia', ra: 2.120, dec: 57.815, magnitude: 3.45 },
  { star_name: 'Alphirk', constellation: 'Cepheus', ra: 327.784, dec: 70.988, magnitude: 3.21 },
  { star_name: 'Diphda', constellation: 'Cetus', ra: 19.734, dec: -18.211, magnitude: 2.02 },
  { star_name: 'Zosma', constellation: 'Leo', ra: 161.695, dec: 20.522, magnitude: 2.56 },
  { star_name: 'Jabbah', constellation: 'Scorpius', ra: 265.622, dec: -25.405, magnitude: 2.29 },
  { star_name: 'Cocibolca', constellation: 'Indus', ra: 322.208, dec: -47.520, magnitude: 3.25 },
  { star_name: 'Antlia', constellation: 'Antlia', ra: 162.949, dec: -35.771, magnitude: 3.36 },
  { star_name: 'Sceptrum', constellation: 'Reticulum', ra: 66.592, dec: -63.036, magnitude: 3.00 },
  { star_name: 'Lesath', constellation: 'Scorpius', ra: 263.622, dec: -37.103, magnitude: 2.87 },
  { star_name: 'Sualocin', constellation: 'Delphinus', ra: 310.357, dec: 15.962, magnitude: 3.68 },
  { star_name: 'Furud', constellation: 'Canis Major', ra: 104.980, dec: -16.195, magnitude: 2.91 },
];
