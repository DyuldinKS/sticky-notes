import { useState, useCallback } from 'react';

export const useResizing = (boardRect, setSticker) => {
  const [state, setState] = useState(null);

  const resize = useCallback(
    event => {
      if (!state) return;

      setSticker({
        ...state,
        position: {
          x: Math.min(state.position.x, event.clientX) - boardRect.left,
          y: Math.min(state.position.y, event.clientY) - boardRect.top,
        },
        size: {
          width: Math.abs(event.clientX - state.position.x),
          height: Math.abs(event.clientY - state.position.y),
        },
      });
    },
    [state, boardRect?.left, boardRect?.top, setSticker]
  );

  const stop = useCallback(() => {
    setState(null);
  }, []);

  return { inProgress: Boolean(state), start: setState, goOn: resize, stop };
};
