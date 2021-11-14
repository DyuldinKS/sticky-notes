import { useEffect, useRef } from 'react';

export const useLazyMouseListeners = (resizing, dragging) => {
  const handlersRef = useRef(null);

  if (resizing.inProgress) {
    handlersRef.current = { onStop: resizing.stop, onMove: resizing.goOn };
  } else if (dragging.inProgress) {
    handlersRef.current = { onStop: dragging.stop, onMove: dragging.goOn };
  } else {
    handlersRef.current = null;
  }

  useEffect(() => {
    if (!handlersRef.current) return;

    const { onStop, onMove } = handlersRef.current;
    document.addEventListener('mouseup', onStop);
    document.addEventListener('mousemove', onMove);

    return () => {
      document.removeEventListener('mouseup', onStop);
      document.removeEventListener('mousemove', onMove);
    };
  }, [handlersRef.current]);
};
