import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import * as THREE from 'three';
import { useStarMapSetup } from '../hooks/useStarMapSetup';
import { useStarMapInteractions } from '../hooks/useStarMapInteractions';

const StarMap = forwardRef(({ showExoplanets, showStarNames, showConstellationLines, onStarClick, onExoplanetClick, autoplay, activeSkyboxes, isDrawMode }, ref) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

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
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
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
  }));

  useEffect(() => {
    setupScene();
    animate();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
    };
  }, [setupScene, animate, handleResize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (isDrawMode) {
      canvas.style.pointerEvents = 'auto';
      controlsRef.current.enabled = false;
    } else {
      canvas.style.pointerEvents = 'none';
      controlsRef.current.enabled = true;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);
    window.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
      window.removeEventListener('click', handleClick);
    };
  }, [isDrawMode, handlePointerDown, handlePointerMove, handlePointerUp, handleClick]);

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
          pointerEvents: isDrawMode ? 'auto' : 'none',
          zIndex: isDrawMode ? 1 : 0,
        }}
      />
    </div>
  );
});

export default StarMap;
