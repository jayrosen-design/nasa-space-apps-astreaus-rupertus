import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const StarMap = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Skybox
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://jayrosen.design/nasa/skybox-space.jpg', () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer, texture);
      scene.background = rt.texture;
    });

    // Camera position
    camera.position.z = 0.1;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;

    // RA and Dec matrix
    const raDecMatrix = createRaDecMatrix();

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const createRaDecMatrix = () => {
    const matrix = [];
    for (let x = -1; x <= 1; x += 0.1) {
      for (let y = -1; y <= 1; y += 0.1) {
        for (let z = -1; z <= 1; z += 0.1) {
          const ra = Math.atan2(y, x) * (180 / Math.PI);
          const dec = Math.asin(z / Math.sqrt(x*x + y*y + z*z)) * (180 / Math.PI);
          matrix.push({ x, y, z, ra, dec });
        }
      }
    }
    return matrix;
  };

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default StarMap;