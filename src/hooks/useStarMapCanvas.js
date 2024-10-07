import { useCallback } from 'react';

export const useStarMapCanvas = (
  canvasRef,
  isPaintMode,
  controlsRef,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handleClick
) => {
  const setupCanvasEventListeners = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
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
  }, [isPaintMode, canvasRef, controlsRef, handlePointerDown, handlePointerMove, handlePointerUp, handleClick]);

  const removeCanvasEventListeners = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    }
    window.removeEventListener('click', handleClick);
  }, [canvasRef, handlePointerDown, handlePointerMove, handlePointerUp, handleClick]);

  return { setupCanvasEventListeners, removeCanvasEventListeners };
};