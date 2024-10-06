import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { exoplanets, constellationStars, constellations } from '../data/starMapData';

const StarMap = forwardRef(({ initialSkyboxUrl, showExoplanets, showStarNames, showConstellationLines, onStarClick }, ref) => {
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
      const exoplanetObj = exoplanetsRef.current[name];
      if (exoplanetObj && exoplanetObj.sphere && cameraRef.current) {
        const position = exoplanetObj.sphere.position;
        cameraRef.current.position.set(
          position.x + 20,
          position.y + 20,
          position.z + 20
        );
        controlsRef.current?.target.copy(position);
        controlsRef.current?.update();
      } else {
        console.warn(`Exoplanet ${name} not found or not properly initialized.`);
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

    const addExoplanets = () => {
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
        const label = createLabel(exoplanet.exoplanet_name, sphere.position, radius);
        scene.add(label);
        exoplanetsRef.current[exoplanet.exoplanet_name] = { sphere, label };
      });
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

    const addConstellationStars = () => {
      constellationStars.forEach((star) => {
        const geometry = new THREE.SphereGeometry(2, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const sphere = new THREE.Mesh(geometry, material);
        
        // Convert RA and Dec to x, y, z coordinates
        const phi = (90 - star.dec) * (Math.PI / 180);
        const theta = star.ra * (Math.PI / 180);
        const radius = 400; // Adjust this value to position stars
        
        sphere.position.set(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
        
        sphere.userData = star; // Store star data for raycasting
        scene.add(sphere);

        // Add star name label
        const label = createLabel(star.star_name, sphere.position, 3);
        scene.add(label);
        starsRef.current[star.star_name] = { sphere, label };
      });
    };

    const addConstellationLines = () => {
      constellations.forEach((constellation) => {
        const stars = constellationStars.filter(star => star.constellation === constellation.name);
        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            const startStar = starsRef.current[stars[i].star_name].sphere;
            const endStar = starsRef.current[stars[j].star_name].sphere;
            
            const geometry = new THREE.BufferGeometry().setFromPoints([startStar.position, endStar.position]);
            const material = new THREE.LineBasicMaterial({ color: 0xff00ff });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            constellationLinesRef.current.push(line);
          }
        }
      });
    };

    addExoplanets();
    addConstellationStars();
    addConstellationLines();

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
      const intersects = raycasterRef.current.intersectObjects(Object.values(starsRef.current).map(({ sphere }) => sphere));

      if (intersects.length > 0) {
        const clickedStar = intersects[0].object.userData;
        onStarClick(clickedStar);
        cameraRef.current.position.set(
          intersects[0].object.position.x + 20,
          intersects[0].object.position.y + 20,
          intersects[0].object.position.z + 20
        );
        controlsRef.current.target.copy(intersects[0].object.position);
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
  }, [initialSkyboxUrl, onStarClick]);

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
