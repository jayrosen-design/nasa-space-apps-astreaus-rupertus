import React, { useEffect, useRef, forwardRef, useImperativeHandle, useMemo, useCallback, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { exoplanets, constellationStars, constellations } from '../data/starMapData';
import { createExoplanets, createConstellationStars, createConstellationLines, createLabel } from './StarMapHelpers';

const StarMap = forwardRef(({ showExoplanets, showStarNames, showConstellationLines, onStarClick, onExoplanetClick, autoplay, activeSkyboxes, isDrawMode }, ref) => {
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

  const zoomToObject = useCallback((position, radius = 10) => {
    if (cameraRef.current && controlsRef.current) {
      const distance = radius * 4; // Increased distance for better visibility
      const newPosition = position.clone().add(new THREE.Vector3(0, 0, distance));
      
      cameraRef.current.position.copy(newPosition);
      controlsRef.current.target.copy(position);
      controlsRef.current.update();
    }
  }, []);

  const updateSkyboxes = useCallback(() => {
    if (sceneRef.current) {
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

  const navigateToExoplanet = useCallback((exoplanetName) => {
    const exoplanet = exoplanetsRef.current[exoplanetName];
    if (exoplanet) {
      zoomToObject(exoplanet.sphere.position, exoplanet.sphere.geometry.parameters.radius * 3);
    }
  }, [zoomToObject]);

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
    updateSkyboxes,
    updateSkybox: (url) => {
      if (sceneRef.current) {
        const skybox = createSkybox(url);
        Object.values(skyboxesRef.current).forEach(oldSkybox => {
          sceneRef.current.remove(oldSkybox);
        });
        skyboxesRef.current = { main: skybox };
        sceneRef.current.add(skybox);
      }
    },
    setZoom: (zoomLevel) => {
      if (cameraRef.current && controlsRef.current) {
        const distance = 500 / Math.pow(2, zoomLevel / 10);
        cameraRef.current.position.setLength(distance);
        controlsRef.current.update();
      }
    },
    navigateToExoplanet,
    navigateToStar: (starName) => {
      const star = starsRef.current[starName];
      if (star) {
        zoomToObject(star.sphere.position, star.sphere.geometry.parameters.radius * 3);
      }
    },
    saveImage: () => {
      const canvas = rendererRef.current.domElement;
      const link = document.createElement('a');
      link.download = 'star-map.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    },
  }));

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

    updateSkyboxes();
  }, [exoplanetObjects, exoplanetLabels, updateSkyboxes]);

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

  const handleMouseDown = useCallback((event) => {
    if (isDrawMode) {
      isDrawingRef.current = true;
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(sceneRef.current.children);
      if (intersects.length > 0) {
        const startPoint = intersects[0].point;
        const geometry = new THREE.BufferGeometry().setFromPoints([startPoint, startPoint]);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        currentLineRef.current = new THREE.Line(geometry, material);
        sceneRef.current.add(currentLineRef.current);
      }
    }
  }, [isDrawMode]);

  const handleMouseMove = useCallback((event) => {
    if (isDrawMode && isDrawingRef.current && currentLineRef.current) {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(sceneRef.current.children);
      if (intersects.length > 0) {
        const endPoint = intersects[0].point;
        const positions = currentLineRef.current.geometry.attributes.position.array;
        positions[3] = endPoint.x;
        positions[4] = endPoint.y;
        positions[5] = endPoint.z;
        currentLineRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  }, [isDrawMode]);

  const handleMouseUp = useCallback(() => {
    if (isDrawMode) {
      isDrawingRef.current = false;
      if (currentLineRef.current) {
        setDrawingLines(prevLines => [...prevLines, currentLineRef.current]);
        currentLineRef.current = null;
      }
    }
  }, [isDrawMode]);

  useEffect(() => {
    setupScene();
    animate();
    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleClick);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
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
