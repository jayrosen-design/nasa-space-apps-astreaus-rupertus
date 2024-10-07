import { useCallback, useRef } from 'react';
import * as THREE from 'three';

export const useStarMapInteractions = (
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
) => {
  const drawingContextRef = useRef(null);

  const handleResize = useCallback(() => {
    if (cameraRef.current && rendererRef.current) {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    }
    if (canvasRef && canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  }, [cameraRef, rendererRef, canvasRef]);

  const handleClick = useCallback((event) => {
    if (!isDrawMode) {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children);

      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (object.userData.type === 'star') {
          onStarClick(object.userData);
          break;
        } else if (object.userData.type === 'exoplanet') {
          onExoplanetClick(object.userData);
          break;
        }
      }
    }
  }, [isDrawMode, onStarClick, onExoplanetClick, mouseRef, raycasterRef, cameraRef, sceneRef]);

  const handlePointerDown = useCallback((event) => {
    if (isDrawMode && canvasRef && canvasRef.current) {
      setIsDrawing(true);
      const ctx = canvasRef.current.getContext('2d');
      drawingContextRef.current = ctx;
      ctx.beginPath();
      ctx.moveTo(event.clientX, event.clientY);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
    }
  }, [isDrawMode, canvasRef, setIsDrawing]);

  const handlePointerMove = useCallback((event) => {
    if (isDrawMode && drawingContextRef.current && canvasRef.current) {
      const ctx = drawingContextRef.current;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }, [isDrawMode]);

  const handlePointerUp = useCallback(() => {
    if (isDrawMode) {
      setIsDrawing(false);
      drawingContextRef.current = null;
    }
  }, [isDrawMode, setIsDrawing]);

  return {
    handleResize,
    handleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};