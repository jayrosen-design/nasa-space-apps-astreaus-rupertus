import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { exoplanets } from '../data/starMapData';

const StarMap = forwardRef(({ initialSkyboxUrl }, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const skyboxRef = useRef(null);
  const labelsRef = useRef([]);
  const exoplanetsRef = useRef({});

  useImperativeHandle(ref, () => ({
    navigateToCoordinates: (coords) => {
      if (cameraRef.current) {
        cameraRef.current.position.set(coords.x, coords.y, coords.z);
        controlsRef.current?.update();
      }
    },
    rotateSkybox: (rotation) => {
      if (skyboxRef.current) {
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
        cameraRef.current.setFocalLength(focalLength);
        cameraRef.current.updateProjectionMatrix();
      }
    },
    navigateToExoplanet: (name) => {
      const exoplanet = exoplanetsRef.current[name];
      if (exoplanet && cameraRef.current) {
        cameraRef.current.position.set(
          exoplanet.position.x + 20,
          exoplanet.position.y + 20,
          exoplanet.position.z + 20
        );
        controlsRef.current?.target.copy(exoplanet.position);
        controlsRef.current?.update();
      }
    },
  }));

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer();
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(initialSkyboxUrl, (texture) => {
      const skyboxGeometry = new THREE.SphereGeometry(500, 60, 40);
      skyboxGeometry.scale(-1, 1, 1);
      const skyboxMaterial = new THREE.MeshBasicMaterial({ map: texture });
      const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
      skyboxRef.current = skybox;
      scene.add(skybox);
    });

    camera.position.set(0, 0, 100);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableZoom = true;
    controls.enablePan = true;

    // Add exoplanets to the scene
    exoplanets.forEach((exoplanet, index) => {
      const radius = 5 + Math.random() * 5; // Random size between 5 and 10
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: Math.random() * 0xffffff,
        emissive: 0x111111,
        specular: 0x333333,
        shininess: 30
      });
      const sphere = new THREE.Mesh(geometry, material);
      
      // Position planets in a spiral
      const angle = index * 0.5;
      const distance = 50 + index * 20;
      sphere.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        (Math.random() - 0.5) * 100
      );
      
      scene.add(sphere);
      exoplanetsRef.current[exoplanet.exoplanet_name] = sphere;

      // Add planet name label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = 'Bold 20px Arial';
      context.fillStyle = 'rgba(255,255,255,0.95)';
      context.fillText(exoplanet.exoplanet_name, 0, 20);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(sphere.position.x, sphere.position.y + radius + 5, sphere.position.z);
      sprite.scale.set(40, 20, 1);
      scene.add(sprite);
      labelsRef.current.push(sprite);
    });

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      if (skyboxRef.current) {
        skyboxRef.current.rotation.y += 0.0001; // Slow rotation around y-axis
      }
      labelsRef.current.forEach(label => {
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

    // Add click event listener for planet selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Object.values(exoplanetsRef.current));

      if (intersects.length > 0) {
        const selectedPlanet = intersects[0].object;
        const planetName = Object.keys(exoplanetsRef.current).find(
          key => exoplanetsRef.current[key] === selectedPlanet
        );
        if (planetName) {
          ref.current.navigateToExoplanet(planetName);
        }
      }
    };

    window.addEventListener('click', onMouseClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', onMouseClick);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
    };
  }, [initialSkyboxUrl]);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
});

export default StarMap;