import { useEffect, useRef } from 'react';

export const useLazyMouseListeners = (resizing, dragging) => {
  const handlersRef = useRef(null);

  handlersRef.current =
    (resizing.inProgress && resizing) || (dragging.inProgress && dragging) || null;

  useEffect(() => {
    if (!handlersRef.current) return;

    const { goOn, stop } = handlersRef.current;
    document.addEventListener('mouseup', stop);
    document.addEventListener('mousemove', goOn);

    return () => {
      document.removeEventListener('mouseup', stop);
      document.removeEventListener('mousemove', goOn);
    };
  }, [handlersRef.current]);
};
