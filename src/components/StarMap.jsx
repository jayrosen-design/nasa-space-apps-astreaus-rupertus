import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import * as THREE from 'three';
import { useStarMapSetup } from '../hooks/useStarMapSetup';
import { useStarMapInteractions } from '../hooks/useStarMapInteractions';
import IframeComponent from './IframeComponent';
import { skyboxOptions } from '../data/starMapData';

const StarMap = forwardRef(({ showExoplanets, showStarNames, showConstellationLines, onObjectClick, autoplay, activeSkyboxes = [skyboxOptions[0]], isPaintMode, initialObjects = [], hideAllObjects = false }, ref) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [showIframe, setShowIframe] = useState(false);

  const {
    sceneRef, cameraRef, controlsRef, rendererRef, skyboxesRef, starsRef,
    exoplanetsRef, constellationLinesRef, raycasterRef, mouseRef,
    setupScene, animate, updateSkyboxes, zoomToObject, createSkybox, createInitialObjects
  } = useStarMapSetup(mountRef, activeSkyboxes, autoplay, initialObjects);

  const {
    handleResize, handleClick, handlePointerDown, handlePointerMove, handlePointerUp, isDrawing, setIsDrawing
  } = useStarMapInteractions(
    cameraRef, controlsRef, sceneRef, rendererRef, raycasterRef, mouseRef,
    starsRef, exoplanetsRef, onObjectClick, onObjectClick, isPaintMode, canvasRef
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
    toggleIframe: () => setShowIframe(prev => !prev),
  }));

  useEffect(() => {
    setupScene();
    animate();
    if (!hideAllObjects) {
      createInitialObjects(initialObjects);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
    };
  }, [setupScene, animate, handleResize, createInitialObjects, initialObjects, hideAllObjects]);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (mountRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    setupCanvasEventListeners();
    return removeCanvasEventListeners;
  }, [isPaintMode, handlePointerDown, handlePointerMove, handlePointerUp, handleClick, canvasSize]);

  const setupCanvasEventListeners = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      canvas.style.pointerEvents = isPaintMode ? 'auto' : 'none';
      canvas.style.zIndex = isPaintMode ? '1' : '0';
      if (controlsRef.current) {
        controlsRef.current.enabled = !isPaintMode;
      }
      if (!isPaintMode) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      canvas.addEventListener('pointerdown', handlePointerDown);
      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerup', handlePointerUp);
      canvas.addEventListener('pointerleave', handlePointerUp);
    }
    if (!isPaintMode) {
      window.addEventListener('click', handleClick);
    }
  };

  const removeCanvasEventListeners = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    }
    window.removeEventListener('click', handleClick);
  };

  const updateVisibility = () => {
    if (hideAllObjects) {
      Object.values(exoplanetsRef.current).forEach(({ sphere, label }) => {
        sphere.visible = false;
        label.visible = false;
      });
      Object.values(starsRef.current).forEach(({ sphere, label }) => {
        sphere.visible = false;
        label.visible = false;
      });
      constellationLinesRef.current.forEach(line => {
        line.visible = false;
      });
    } else {
      Object.values(exoplanetsRef.current).forEach(({ sphere, label }) => {
        sphere.visible = showExoplanets;
        label.visible = showExoplanets;
      });
      Object.values(starsRef.current).forEach(({ sphere, label }) => {
        sphere.visible = true;
        label.visible = showStarNames;
      });
      constellationLinesRef.current.forEach(line => {
        line.visible = showConstellationLines;
      });
    }
  };

  useEffect(() => {
    updateVisibility();
  }, [showExoplanets, showStarNames, showConstellationLines, hideAllObjects]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {!showIframe ? (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: isPaintMode ? 'auto' : 'none',
            zIndex: isPaintMode ? 1 : 0,
          }}
        />
      ) : (
        <IframeComponent />
      )}
    </div>
  );
});

export default StarMap;
