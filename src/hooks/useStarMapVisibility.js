import { useCallback } from 'react';

export const useStarMapVisibility = (exoplanetsRef, starsRef, constellationLinesRef, hideAllObjects) => {
  const updateVisibility = useCallback(() => {
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
        sphere.visible = true;
        label.visible = true;
      });
      Object.values(starsRef.current).forEach(({ sphere, label }) => {
        sphere.visible = true;
        label.visible = true;
      });
      constellationLinesRef.current.forEach(line => {
        line.visible = true;
      });
    }
  }, [exoplanetsRef, starsRef, constellationLinesRef, hideAllObjects]);

  return { updateVisibility };
};