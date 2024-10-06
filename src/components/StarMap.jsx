import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
    addExoplanet: (name, coords) => {
      if (sceneRef.current && !exoplanetsRef.current[name]) {
        const geometry = new THREE.SphereGeometry(5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(coords.x, coords.y, coords.z);
        sceneRef.current.add(sphere);
        exoplanetsRef.current[name] = sphere;
      }
    },
    navigateToExoplanet: (name) => {
      const exoplanet = exoplanetsRef.current[name];
      if (exoplanet && cameraRef.current) {
        cameraRef.current.position.set(
          exoplanet.position.x + 10,
          exoplanet.position.y + 10,
          exoplanet.position.z + 10
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

    camera.position.set(0, 0, 0.1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableZoom = true;
    controls.enablePan = true;

    const constellations = [
      { name: 'Orion', position: new THREE.Vector3(83.82, 5.39, -2.42) },
      { name: 'Ursa Major', position: new THREE.Vector3(165.46, 61.75, -8.93) },
      { name: 'Cassiopeia', position: new THREE.Vector3(10.68, 59.15, 2.36) },
      { name: 'Leo', position: new THREE.Vector3(177.47, 14.47, -10.76) },
      { name: 'Scorpius', position: new THREE.Vector3(247.36, -26.43, -4.22) },
      { name: 'Taurus', position: new THREE.Vector3(66.57, 16.51, -3.74) },
      { name: 'Gemini', position: new THREE.Vector3(113.65, 28.03, -8.11) },
      { name: 'Cygnus', position: new THREE.Vector3(305.56, 40.73, 4.22) },
      { name: 'Canis Major', position: new THREE.Vector3(101.28, -16.71, -5.13) },
      { name: 'Lyra', position: new THREE.Vector3(284.74, 32.69, 4.48) },
      { name: 'Aquila', position: new THREE.Vector3(297.69, 8.87, 3.71) },
      { name: 'Pegasus', position: new THREE.Vector3(344.41, 15.21, 3.51) },
    ];

    constellations.forEach(({ name, position }) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = 'Bold 20px Arial';
      context.fillStyle = 'rgba(255,255,255,0.95)';
      context.fillText(name, 0, 20);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(position);
      sprite.scale.set(50, 25, 1);
      scene.add(sprite);
      labelsRef.current.push(sprite);
    });

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

    return () => {
      window.removeEventListener('resize', handleResize);
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