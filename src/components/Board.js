import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Sticker } from './Sticker';

export const Board = forwardRef(function Board(
  { stickers, setSticker, dropSticker, addSticker },
  ref
) {
  const dropZoneRef = useRef();
  const [creatingSticker, setCreatingSticker] = useState(null);
  const [isItemInDropZone, setIsItemInDropZone] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(null);

  const isInDropZone = useCallback((x, y) => {
    if (!dropZoneRef.current) return false;

    const rect = dropZoneRef.current.getBoundingClientRect();
    return rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom;
  }, []);

  const onDragStop = (id, x, y, newStyle) => {
    if (isInDropZone(x, y)) {
      dropSticker(id);
      setIsItemInDropZone(false);
    } else {
      setSticker({ ...stickers[id], style: newStyle });
    }
  };

  const onMove = (x, y) => {
    const inDropZone = isInDropZone(x, y);
    if (inDropZone !== isItemInDropZone) {
      setIsItemInDropZone(inDropZone);
    }
  };

  const startCreatingSticker = event => {
    setCreatingSticker({ x: event.clientX, y: event.clientY });
  };

  const stopCreatingSticker = useCallback(
    event => {
      setCreatingSticker(null);
      setCursorPosition(null);
      addSticker(
        Math.abs(event.clientX - creatingSticker.x),
        Math.abs(event.clientY - creatingSticker.y),
        creatingSticker.x - rect.left,
        creatingSticker.y - rect.top
      );
    },
    [creatingSticker, addSticker]
  );

  const continueCreatingSticker = event => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    if (creatingSticker) {
      // Can't use onMouseUp, onMouseMove JSX handlers, since when cursor goes out from the element these events aren't fired.
      document.addEventListener('mouseup', stopCreatingSticker);
      document.addEventListener('mousemove', continueCreatingSticker);

      return () => {
        document.removeEventListener('mouseup', stopCreatingSticker);
        document.addEventListener('mousemove', continueCreatingSticker);
      };
    }
  }, [creatingSticker, stopCreatingSticker]);

  const rect = ref.current?.getBoundingClientRect();

  return (
    <div ref={ref} className="Board" onMouseDown={startCreatingSticker}>
      {Object.values(stickers)
        .sort((a, b) => a.clickedAt - b.clickedAt)
        .map(sticker => (
          <Sticker
            key={sticker.id}
            sticker={sticker}
            onDragStop={onDragStop}
            setSticker={setSticker}
            onMove={onMove}
          />
        ))}
      {cursorPosition && creatingSticker && (
        <div
          className="new-sticker"
          style={{
            top: creatingSticker.y - rect.top,
            left: creatingSticker.x - rect.left,
            width: cursorPosition.x - creatingSticker.x,
            height: cursorPosition.y - creatingSticker.y,
          }}
        ></div>
      )}
      <div ref={dropZoneRef} className={'dropZone' + (isItemInDropZone ? ' active' : '')}>
        Drop zone
      </div>
    </div>
  );
});
