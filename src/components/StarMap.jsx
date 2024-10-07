import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import * as THREE from 'three';
import { useStarMapSetup } from '../hooks/useStarMapSetup';
import { useStarMapInteractions } from '../hooks/useStarMapInteractions';
import IframeComponent from './IframeComponent';
import { skyboxOptions } from '../data/starMapData';

const StarMap = forwardRef(({ showExoplanets, showStarNames, showConstellationLines, onObjectClick, autoplay, activeSkyboxes = [skyboxOptions[0]], isDrawMode, initialObjects = [] }, ref) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [showIframe, setShowIframe] = useState(false);

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
    createSkybox,
    createInitialObjects
  } = useStarMapSetup(mountRef, activeSkyboxes, autoplay, initialObjects);

  const {
    handleResize,
    handleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useStarMapInteractions(
    cameraRef,
    controlsRef,
    sceneRef,
    rendererRef,
    raycasterRef,
    mouseRef,
    starsRef,
    exoplanetsRef,
    onStarClick,
    onExoplanetClick,
    isDrawMode,
    setIsDrawing,
    canvasRef
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
    createInitialObjects(initialObjects);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
    };
  }, [setupScene, animate, handleResize, createInitialObjects, initialObjects]);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (mountRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    setupCanvasEventListeners();
    return () => removeCanvasEventListeners();
  }, [isDrawMode, handlePointerDown, handlePointerMove, handlePointerUp, handleClick, canvasSize]);

  const handleClick = (event) => {
    if (!isDrawMode) {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);

      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (object.userData.clickable) {
          onObjectClick(object.userData);
          break;
        }
      }
    }
  };

  const setupCanvasEventListeners = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      canvas.style.pointerEvents = isDrawMode ? 'auto' : 'none';
      canvas.style.zIndex = isDrawMode ? '1' : '0';
      if (controlsRef.current) {
        controlsRef.current.enabled = !isDrawMode;
      }

      if (!isDrawMode) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      canvas.addEventListener('pointerdown', handlePointerDown);
      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerup', handlePointerUp);
      canvas.addEventListener('pointerleave', handlePointerUp);
    }

    window.addEventListener('click', handleClick);
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
  };

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
            pointerEvents: isDrawMode ? 'auto' : 'none',
            zIndex: isDrawMode ? 1 : 0,
          }}
        />
      ) : (
        <IframeComponent />
      )}
    </div>
  );
});

export default StarMap;
