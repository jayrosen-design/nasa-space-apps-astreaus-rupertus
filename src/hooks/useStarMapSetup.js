import { useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { exoplanets, constellationStars, constellations } from '../data/starMapData';
import { createExoplanets, createConstellationStars, createConstellationLines } from '../components/StarMapHelpers';

export const useStarMapSetup = (mountRef, activeSkyboxes, autoplay) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const skyboxesRef = useRef({});
  const starsRef = useRef({});
  const exoplanetsRef = useRef({});
  const constellationLinesRef = useRef([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const { exoplanetObjects, exoplanetLabels } = useMemo(() => createExoplanets(exoplanets), []);

  const createSkybox = useCallback((url, opacity = 1) => {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(url);
    const skyboxGeometry = new THREE.SphereGeometry(500, 60, 40);
    skyboxGeometry.scale(-1, 1, 1);
    const skyboxMaterial = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
      opacity: opacity
    });
    return new THREE.Mesh(skyboxGeometry, skyboxMaterial);
  }, []);

  const zoomToObject = useCallback((position, radius = 10) => {
    if (cameraRef.current && controlsRef.current) {
      const distance = radius * 4;
      const newPosition = position.clone().add(new THREE.Vector3(0, 0, distance));
      
      cameraRef.current.position.copy(newPosition);
      controlsRef.current.target.copy(position);
      controlsRef.current.update();
    }
  }, []);

  const updateSkyboxes = useCallback(() => {
    if (sceneRef.current && Array.isArray(activeSkyboxes)) {
      Object.values(skyboxesRef.current).forEach(skybox => {
        sceneRef.current.remove(skybox);
      });
      activeSkyboxes.forEach(skyboxOption => {
        const skybox = createSkybox(skyboxOption.value, skyboxOption.layer === 'overlay' ? 0.5 : 1);
        skyboxesRef.current[skyboxOption.label] = skybox;
        sceneRef.current.add(skybox);
      });
    }
  }, [activeSkyboxes, createSkybox]);

  const setupScene = useCallback(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.set(0, 0, 100);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableZoom = true;
    controls.enablePan = true;

    exoplanetObjects.forEach(obj => scene.add(obj));
    exoplanetLabels.forEach(label => scene.add(label));
    exoplanetsRef.current = exoplanetObjects.reduce((acc, obj, index) => {
      acc[exoplanets[index].exoplanet_name] = { sphere: obj, label: exoplanetLabels[index] };
      return acc;
    }, {});

    const { starObjects, starLabels } = createConstellationStars(constellationStars);
    starObjects.forEach(obj => scene.add(obj));
    starLabels.forEach(label => scene.add(label));
    starsRef.current = starObjects.reduce((acc, obj, index) => {
      acc[constellationStars[index].star_name] = { sphere: obj, label: starLabels[index] };
      return acc;
    }, {});

    constellationLinesRef.current = createConstellationLines(constellations, starsRef.current);
    constellationLinesRef.current.forEach(line => scene.add(line));

    scene.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    if (Array.isArray(activeSkyboxes) && activeSkyboxes.length > 0) {
      updateSkyboxes();
    }
  }, [exoplanetObjects, exoplanetLabels, updateSkyboxes, activeSkyboxes]);

  const animate = useCallback(() => {
    requestAnimationFrame(animate);
    controlsRef.current.update();
    if (autoplay) {
      Object.values(skyboxesRef.current).forEach(skybox => {
        skybox.rotation.y += 0.0001;
      });
    }
    Object.values(exoplanetsRef.current).forEach(({ label }) => {
      label.quaternion.copy(cameraRef.current.quaternion);
    });
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, [autoplay]);

  return {
    sceneRef,
    cameraRef,
    controlsRef,
    rendererRef,
    skyboxesRef,
    starsRef,
    exoplanetsRef,
    constellationLinesRef,
    raycasterRef,
    mouseRef,
    setupScene,
    animate,
    updateSkyboxes,
    zoomToObject,
    createSkybox
  };
};
