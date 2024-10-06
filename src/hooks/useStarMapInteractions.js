import { useCallback } from 'react';
import * as THREE from 'three';

export const useStarMapInteractions = (
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
) => {
  const handleResize = useCallback(() => {
    if (cameraRef.current && rendererRef.current) {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    }
  }, []);

  const handleClick = useCallback((event) => {
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
  }, [onStarClick, onExoplanetClick]);

  const handleMouseDown = useCallback((event) => {
    if (isDrawMode) {
      setIsDrawing(true);
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(sceneRef.current.children);
      if (intersects.length > 0) {
        const startPoint = intersects[0].point;
        const geometry = new THREE.BufferGeometry().setFromPoints([startPoint, startPoint]);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        currentLineRef.current = new THREE.Line(geometry, material);
        sceneRef.current.add(currentLineRef.current);
      }
    }
  }, [isDrawMode, setIsDrawing]);

  const handleMouseMove = useCallback((event) => {
    if (isDrawMode && currentLineRef.current) {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(sceneRef.current.children);
      if (intersects.length > 0) {
        const endPoint = intersects[0].point;
        const positions = currentLineRef.current.geometry.attributes.position.array;
        positions[3] = endPoint.x;
        positions[4] = endPoint.y;
        positions[5] = endPoint.z;
        currentLineRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  }, [isDrawMode]);

  const handleMouseUp = useCallback(() => {
    if (isDrawMode) {
      setIsDrawing(false);
      if (currentLineRef.current) {
        setDrawingLines(prevLines => [...prevLines, currentLineRef.current]);
        currentLineRef.current = null;
      }
    }
  }, [isDrawMode, setIsDrawing, setDrawingLines]);

  return {
    handleResize,
    handleClick,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};