import React, { useEffect, useRef, forwardRef, useImperativeHandle, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { exoplanets, constellationStars, constellations } from '../data/starMapData';
import { createSkybox, createExoplanets, createConstellationStars, createConstellationLines } from './StarMapHelpers';

const StarMap = forwardRef(({ initialSkyboxUrl, showExoplanets, showStarNames, showConstellationLines, onStarClick, onExoplanetClick, autoplay }, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const skyboxRef = useRef(null);
  const starsRef = useRef({});
  const exoplanetsRef = useRef({});
  const constellationLinesRef = useRef([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const { exoplanetObjects, exoplanetLabels } = useMemo(() => createExoplanets(exoplanets), []);

  const zoomToObject = useCallback((position, radius = 10) => {
    if (cameraRef.current && controlsRef.current) {
      const distance = radius * 3;
      const direction = new THREE.Vector3().subVectors(cameraRef.current.position, position).normalize();
      const newPosition = new THREE.Vector3().addVectors(position, direction.multiplyScalar(distance));
      
      cameraRef.current.position.copy(newPosition);
      controlsRef.current.target.copy(position);
      controlsRef.current.update();
    }
  }, []);

  useImperativeHandle(ref, () => ({
    navigateToCoordinates: (coords) => {
      const position = new THREE.Vector3(coords.x, coords.y, coords.z);
      zoomToObject(position);
    },
    rotateSkybox: (rotation) => {
      if (skyboxRef.current && autoplay) {
        skyboxRef.current.rotation.y += rotation;
      }
    },
    updateSkybox: (url) => {
      if (skyboxRef.current && sceneRef.current) {
        new THREE.TextureLoader().load(url, (texture) => {
          skyboxRef.current.material.map = texture;
          skyboxRef.current.material.needsUpdate = true;
        });
      }
    },
    setZoom: (focalLength) => {
      if (cameraRef.current) {
        cameraRef.current.zoom = focalLength / 35;
        cameraRef.current.updateProjectionMatrix();
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

    skyboxRef.current = createSkybox(initialSkyboxUrl);
    scene.add(skyboxRef.current);

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
  }, [initialSkyboxUrl, exoplanetObjects, exoplanetLabels]);

  const animate = useCallback(() => {
    requestAnimationFrame(animate);
    controlsRef.current.update();
    if (autoplay && skyboxRef.current) {
      skyboxRef.current.rotation.y += 0.0001;
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
