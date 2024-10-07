import { useCallback, useRef, useState } from 'react';
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
  canvasRef
) => {
  const drawingContextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

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
  }, [isDrawMode, canvasRef]);

  const handlePointerMove = useCallback((event) => {
    if (isDrawMode && isDrawing && drawingContextRef.current && canvasRef.current) {
      const ctx = drawingContextRef.current;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }, [isDrawMode, isDrawing, canvasRef]);

  const handlePointerUp = useCallback(() => {
    if (isDrawMode) {
      setIsDrawing(false);
    }
  }, [isDrawMode]);

  return {
    handleResize,
    handleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isDrawing,
    setIsDrawing
  };
};