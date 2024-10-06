import React, { useEffect, useRef, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { exoplanets, constellationStars, constellations, skyboxOptions } from '../data/starMapData';
import { createExoplanets, createConstellationStars, createConstellationLines } from './StarMapHelpers';

const StarMap = forwardRef(({ initialSkyboxUrl, showExoplanets, showStarNames, showConstellationLines, onStarClick, onExoplanetClick, autoplay, activeSkyboxes }, ref) => {
  const mountRef = useRef(null);
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

  const updateSkyboxes = useCallback(() => {
    if (sceneRef.current) {
      // Remove existing skyboxes
      Object.values(skyboxesRef.current).forEach(skybox => {
        sceneRef.current.remove(skybox);
      });

      // Add active skyboxes
      activeSkyboxes.forEach(skyboxOption => {
        const skybox = createSkybox(skyboxOption.value, skyboxOption.layer === 'overlay' ? 0.5 : 1);
        skyboxesRef.current[skyboxOption.label] = skybox;
        sceneRef.current.add(skybox);
      });
    }
  }, [activeSkyboxes, createSkybox]);

  useImperativeHandle(ref, () => ({
    navigateToCoordinates: (coords) => {
      const position = new THREE.Vector3(coords.x, coords.y, coords.z);
      zoomToObject(position);
    },
    rotateSkybox: (rotation) => {
      if (skyboxesRef.current && autoplay) {
        Object.values(skyboxesRef.current).forEach(skybox => {
          skybox.rotation.y += rotation;
        });
      }
    },
    updateSkyboxes: updateSkyboxes,
    setZoom: (focalLength) => {
      if (cameraRef.current) {
        const newZoom = focalLength / 35;
        cameraRef.current.zoom = newZoom;
        cameraRef.current.updateProjectionMatrix();
        controlsRef.current.update();
      }
    },
    navigateToExoplanet: (name) => {
      const exoplanetObj = exoplanetsRef.current[name];
      if (exoplanetObj && exoplanetObj.sphere) {
        zoomToObject(exoplanetObj.sphere.position, exoplanetObj.sphere.geometry.parameters.radius);
      }
    },
  }));

  const setupScene = useCallback(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer();
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

    updateSkyboxes();
  }, [initialSkyboxUrl, exoplanetObjects, exoplanetLabels, updateSkyboxes]);

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

  const handleClick = useCallback((event) => {
    event.preventDefault();
    mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const starIntersects = raycasterRef.current.intersectObjects(Object.values(starsRef.current).map(({ sphere }) => sphere));
    const exoplanetIntersects = raycasterRef.current.intersectObjects(Object.values(exoplanetsRef.current).map(({ sphere }) => sphere));

    if (starIntersects.length > 0) {
      const clickedStar = starIntersects[0].object.userData;
      onStarClick(clickedStar);
      zoomToObject(starIntersects[0].object.position, starIntersects[0].object.geometry.parameters.radius);
    } else if (exoplanetIntersects.length > 0 && showExoplanets) {
      const clickedExoplanet = exoplanetIntersects[0].object.userData;
      onExoplanetClick(clickedExoplanet);
      zoomToObject(exoplanetIntersects[0].object.position, exoplanetIntersects[0].object.geometry.parameters.radius);
    }
  }, [onStarClick, onExoplanetClick, showExoplanets, zoomToObject]);

  const handleResize = useCallback(() => {
    if (cameraRef.current && rendererRef.current) {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    }
  }, []);

  useEffect(() => {
    setupScene();
    animate();
    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
    };
  }, [setupScene, animate, handleResize, handleClick]);

  useEffect(() => {
    Object.values(exoplanetsRef.current).forEach(({ sphere, label }) => {
      sphere.visible = showExoplanets;
      label.visible = showExoplanets;
    });

    Object.values(starsRef.current).forEach(({ label }) => {
      label.visible = showStarNames;
    });

    constellationLinesRef.current.forEach(line => {
      line.visible = showConstellationLines;
    });
  }, [showExoplanets, showStarNames, showConstellationLines]);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
});

export default StarMap;
