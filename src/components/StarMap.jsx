import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useStarMapSetup } from '../hooks/useStarMapSetup';
import { useStarMapInteractions } from '../hooks/useStarMapInteractions';
import { skyboxOptions } from '../data/starMapData';
import { useStarMapVisibility } from '../hooks/useStarMapVisibility';
import { useStarMapCanvas } from '../hooks/useStarMapCanvas';

const StarMap = forwardRef(({ showExoplanets, showStarNames, showConstellationLines, onObjectClick, autoplay, activeSkyboxes = [skyboxOptions[0]], isPaintMode, initialObjects = [], hideAllObjects = false, paintColor = 'white' }, ref) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);

  const {
    sceneRef, cameraRef, controlsRef, rendererRef, skyboxesRef,
    starsRef, exoplanetsRef, constellationLinesRef, raycasterRef, mouseRef,
    setupScene, animate, updateSkyboxes, zoomToObject, createSkybox, createInitialObjects
  } = useStarMapSetup(mountRef, activeSkyboxes, autoplay, initialObjects);

  const {
    handleResize, handleClick, handlePointerDown, handlePointerMove, handlePointerUp
  } = useStarMapInteractions(
    cameraRef, controlsRef, sceneRef, rendererRef, raycasterRef, mouseRef,
    starsRef, exoplanetsRef, onObjectClick, onObjectClick, isPaintMode, canvasRef, paintColor
  );

  const { updateVisibility } = useStarMapVisibility(exoplanetsRef, starsRef, constellationLinesRef, hideAllObjects);

  const { setupCanvasEventListeners, removeCanvasEventListeners } = useStarMapCanvas(
    canvasRef, isPaintMode, controlsRef, handlePointerDown, handlePointerMove, handlePointerUp, handleClick
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
    setupCanvasEventListeners();
    return removeCanvasEventListeners;
  }, [isPaintMode, setupCanvasEventListeners, removeCanvasEventListeners]);

  useEffect(() => {
    updateVisibility();
  }, [showExoplanets, showStarNames, showConstellationLines, hideAllObjects, updateVisibility]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100vh', position: 'relative' }}>
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
    </div>
  );
});

export default StarMap;
