import { useCallback, useEffect, useRef, useState } from 'react';
import { Sticker } from './Sticker';

export const Board = ({ stickers, setSticker, dropSticker, addSticker }) => {
  const boardRef = useRef();
  const dropZoneRef = useRef();
  const [isItemInDropZone, setIsItemInDropZone] = useState(false);
  const [resizingSticker, setResizingSticker] = useState(null);
  const [movingSticker, setMovingSticker] = useState(null);

  const rect = boardRef.current?.getBoundingClientRect();

  const isInDropZone = useCallback((x, y) => {
    if (!dropZoneRef.current) return false;

    const rect = dropZoneRef.current.getBoundingClientRect();
    return rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom;
  }, []);

  const createSticker = event => {
    if (event.target !== boardRef.current) return;

    const x = event.clientX;
    const y = event.clientY;
    const newSticker = addSticker({ x, y, width: 0, height: 0 });
    setResizingSticker(newSticker);
  };

  const resize = useCallback(
    event => {
      if (!resizingSticker) return;

      const updatedSticker = {
        ...resizingSticker,
        position: {
          x: Math.min(resizingSticker.position.x, event.clientX) - rect.left,
          y: Math.min(resizingSticker.position.y, event.clientY) - rect.top,
        },
        size: {
          width: Math.abs(event.clientX - resizingSticker.position.x),
          height: Math.abs(event.clientY - resizingSticker.position.y),
        },
      };
      setSticker(updatedSticker);
    },
    [resizingSticker]
  );

  const stopResizing = useCallback(() => {
    setResizingSticker(null);
  }, []);

  const startMoving = (id, x, y) => {
    const sticker = stickers[id];
    const initialDiff = {
      x: sticker.position.x - x,
      y: sticker.position.y - y,
    };
    setMovingSticker({ initialDiff, sticker });
  };

  const move = event => {
    if (!movingSticker) return;

    setSticker({
      ...movingSticker.sticker,
      position: {
        x: event.clientX + movingSticker.initialDiff.x - rect.left,
        y: event.clientY + movingSticker.initialDiff.y - rect.top,
      },
    });

    const inDropZone = isInDropZone(event.clientX, event.clientY);
    if (inDropZone !== isItemInDropZone) {
      setIsItemInDropZone(inDropZone);
    }
  };

  const stopMoving = event => {
    setMovingSticker(null);

    const inDropZone = isInDropZone(event.clientX, event.clientY);
    if (inDropZone) {
      dropSticker(movingSticker.sticker.id);
      setIsItemInDropZone(false);
    }
  };

  const bringToFore = id => {
    setSticker({ ...stickers[id], clickedAt: Date.now() });
  };

  const handlersRef = useRef(null);
  if (resizingSticker) {
    handlersRef.current = { onStop: stopResizing, onMove: resize };
  } else if (movingSticker) {
    handlersRef.current = { onStop: stopMoving, onMove: move };
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

  return (
    <div ref={boardRef} className="Board" onMouseDown={createSticker}>
      {Object.values(stickers)
        .sort((a, b) => a.clickedAt - b.clickedAt)
        .map(sticker => (
          <Sticker
            key={sticker.id}
            sticker={sticker}
            startMoving={startMoving}
            bringToFore={bringToFore}
          />
        ))}
      <div ref={dropZoneRef} className={'dropZone' + (isItemInDropZone ? ' active' : '')}>
        Drop zone
      </div>
    </div>
  );
};
