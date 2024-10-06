import * as THREE from 'three';

export const createSkybox = (url) => {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(url);
  const skyboxGeometry = new THREE.SphereGeometry(500, 60, 40);
  skyboxGeometry.scale(-1, 1, 1);
  const skyboxMaterial = new THREE.MeshBasicMaterial({ map: texture });
  return new THREE.Mesh(skyboxGeometry, skyboxMaterial);
};

export const createExoplanets = (exoplanets) => {
  const exoplanetObjects = [];
  const exoplanetLabels = [];

  exoplanets.forEach((exoplanet) => {
    const radius = Math.random() * 5 + 2; // Random size between 2 and 7
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(Math.random(), Math.random(), Math.random()), // Random color
      emissive: 0x111111,
      specular: 0x333333,
      shininess: 30
    });
    const sphere = new THREE.Mesh(geometry, material);
    
    // Random position within a sphere
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const distance = Math.random() * 300 + 100; // Random distance between 100 and 400
    sphere.position.set(
      distance * Math.sin(phi) * Math.cos(theta),
      distance * Math.sin(phi) * Math.sin(theta),
      distance * Math.cos(phi)
    );
    
    sphere.userData = exoplanet;
    exoplanetObjects.push(sphere);

    const label = createLabel(exoplanet.exoplanet_name, sphere.position, radius);
    exoplanetLabels.push(label);
  });

  return { exoplanetObjects, exoplanetLabels };
};

export const createConstellationStars = (constellationStars) => {
  const starObjects = [];
  const starLabels = [];

  constellationStars.forEach((star) => {
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphere = new THREE.Mesh(geometry, material);
    
    const phi = (90 - star.dec) * (Math.PI / 180);
    const theta = star.ra * (Math.PI / 180);
    const radius = 400;
    
    sphere.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
    
    sphere.userData = star;
    starObjects.push(sphere);

    const label = createLabel(star.star_name, sphere.position, 3);
    starLabels.push(label);
  });

  return { starObjects, starLabels };
};

export const createConstellationLines = (constellations, starsRef) => {
  const lines = [];
  constellations.forEach((constellation) => {
    const stars = Object.values(starsRef).filter(star => star.sphere.userData.constellation === constellation.name);
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const startStar = stars[i].sphere;
        const endStar = stars[j].sphere;
        
        const geometry = new THREE.BufferGeometry().setFromPoints([startStar.position, endStar.position]);
        const material = new THREE.LineBasicMaterial({ color: 0xff00ff });
        const line = new THREE.Line(geometry, material);
        lines.push(line);
      }
    }
  });
  return lines;
};

const createLabel = (text, position, offset) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = 'Bold 20px Arial';
  context.fillStyle = 'rgba(255,255,255,0.95)';
  context.fillText(text, 0, 20);
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.set(position.x, position.y + offset + 5, position.z);
  sprite.scale.set(40, 20, 1);
  return sprite;
};