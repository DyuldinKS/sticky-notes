import { useState } from 'react';

export const useDragging = (boardRect, stickers, setSticker, dropSticker, dropZoneState) => {
  const [state, setState] = useState(null);
  const start = (id, x, y) => {
    const sticker = stickers[id];
    const initialDiff = {
      x: sticker.position.x - x,
      y: sticker.position.y - y,
    };
    setState({ initialDiff, sticker });
  };

  const drag = event => {
    if (!state) return;

    setSticker({
      ...state.sticker,
      position: {
        x: event.clientX + state.initialDiff.x - boardRect.left,
        y: event.clientY + state.initialDiff.y - boardRect.top,
      },
    });

    const inDropZone = dropZoneState.getIsPointInDropZone(event.clientX, event.clientY);
    if (inDropZone !== dropZoneState.isItemInDropZone) {
      dropZoneState.setIsItemInDropZone(inDropZone);
    }
  };

  const stopDragging = event => {
    setState(null);

    const inDropZone = dropZoneState.getIsPointInDropZone(event.clientX, event.clientY);
    if (inDropZone) {
      dropSticker(state.sticker.id);
      dropZoneState.setIsItemInDropZone(false);
    }
  };

  return { inProgress: Boolean(state), start, goOn: drag, stop: stopDragging };
};
