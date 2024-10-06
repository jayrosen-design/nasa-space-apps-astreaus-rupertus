import React, { useEffect, useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
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

  // Create exoplanets only once
  const { exoplanetObjects, exoplanetLabels } = useMemo(() => createExoplanets(exoplanets), []);

  useImperativeHandle(ref, () => ({
    navigateToCoordinates: (coords) => {
      if (cameraRef.current) {
        cameraRef.current.position.set(coords.x, coords.y, coords.z);
        controlsRef.current?.update();
      }
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
        const position = exoplanetObj.sphere.position;
        const offset = 50;
        const newCameraPosition = new THREE.Vector3(
          position.x + offset,
          position.y + offset,
          position.z + offset
        );
        
        cameraRef.current.position.copy(newCameraPosition);
        controlsRef.current.target.copy(position);
        controlsRef.current.update();
        
        // Highlight the exoplanet
        const originalColor = exoplanetObj.sphere.material.color.getHex();
        exoplanetObj.sphere.material.color.setHex(0xffff00);
        setTimeout(() => {
          exoplanetObj.sphere.material.color.setHex(originalColor);
        }, 2000);
      }
    },
  }));

  useEffect(() => {
  useEffect(() => {
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


    // Add exoplanets to the scene
    exoplanetObjects.forEach(obj => sceneRef.current.add(obj));
    exoplanetLabels.forEach(label => sceneRef.current.add(label));
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

    // Add lights
    scene.add(new THREE.AmbientLight(0x404040));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      if (skyboxRef.current && autoplay) {
        skyboxRef.current.rotation.y += 0.0001;
      }
      Object.values(exoplanetsRef.current).forEach(({ label }) => {
        label.quaternion.copy(camera.quaternion);
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    const handleClick = (event) => {
      event.preventDefault();
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const starIntersects = raycasterRef.current.intersectObjects(Object.values(starsRef.current).map(({ sphere }) => sphere));
      const exoplanetIntersects = raycasterRef.current.intersectObjects(Object.values(exoplanetsRef.current).map(({ sphere }) => sphere));

      if (starIntersects.length > 0) {
        const clickedStar = starIntersects[0].object.userData;
        onStarClick(clickedStar);
        cameraRef.current.position.set(
          starIntersects[0].object.position.x + 20,
          starIntersects[0].object.position.y + 20,
          starIntersects[0].object.position.z + 20
        );
        controlsRef.current.target.copy(starIntersects[0].object.position);
        controlsRef.current.update();
      } else if (exoplanetIntersects.length > 0 && showExoplanets) {
        const clickedExoplanet = exoplanetIntersects[0].object.userData;
        onExoplanetClick(clickedExoplanet);
        cameraRef.current.position.set(
          exoplanetIntersects[0].object.position.x + 50,
          exoplanetIntersects[0].object.position.y + 50,
          exoplanetIntersects[0].object.position.z + 50
        );
        controlsRef.current.target.copy(exoplanetIntersects[0].object.position);
        controlsRef.current.update();
      }
    };

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

  }, [initialSkyboxUrl, onStarClick, onExoplanetClick, showExoplanets, autoplay, exoplanetObjects, exoplanetLabels]);

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
