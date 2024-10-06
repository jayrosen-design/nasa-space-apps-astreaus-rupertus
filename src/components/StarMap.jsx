import React, { useEffect, useRef, forwardRef, useImperativeHandle, useMemo, useCallback, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { exoplanets, constellationStars, constellations } from '../data/starMapData';
import { createExoplanets, createConstellationStars, createConstellationLines, createLabel } from './StarMapHelpers';
import { useStarMapSetup } from '../hooks/useStarMapSetup';
import { useStarMapInteractions } from '../hooks/useStarMapInteractions';

const StarMap = forwardRef(({ showExoplanets, showStarNames, showConstellationLines, onStarClick, onExoplanetClick, autoplay, activeSkyboxes, isDrawMode }, ref) => {
  const mountRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingLines, setDrawingLines] = useState([]);
  const currentLineRef = useRef(null);

  const {
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
  } = useStarMapSetup(mountRef, activeSkyboxes, autoplay);

  const {
    handleResize,
    handleClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useStarMapInteractions(
    cameraRef,
    controlsRef,
    sceneRef,
    raycasterRef,
    mouseRef,
    starsRef,
    exoplanetsRef,
    onStarClick,
    onExoplanetClick,
    isDrawMode,
    setIsDrawing,
    currentLineRef,
    setDrawingLines
  );

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
    navigateToExoplanet: (exoplanetName) => {
      const exoplanet = exoplanetsRef.current[exoplanetName];
      if (exoplanet) {
        zoomToObject(exoplanet.sphere.position, exoplanet.sphere.geometry.parameters.radius * 3);
      }
    },
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
  }, [setupScene, animate, handleResize, handleClick, handleMouseDown, handleMouseMove, handleMouseUp]);

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