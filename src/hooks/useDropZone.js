import { useState, useCallback } from 'react';

export const useDropZone = dropZoneRef => {
  const [isItemInDropZone, setIsItemInDropZone] = useState(false);

  const getIsPointInDropZone = useCallback(
    (x, y) => {
      if (!dropZoneRef.current) return false;

      const rect = dropZoneRef.current.getBoundingClientRect();
      return rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom;
    },
    [dropZoneRef]
  );

  return { isItemInDropZone, setIsItemInDropZone, getIsPointInDropZone };
};
