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

  const rect = ref.current?.getBoundingClientRect();
  const showStickerCreation = cursorPosition && creatingSticker;

  const newStickerStyleRef = useRef();
  newStickerStyleRef.current = showStickerCreation && {
    top: Math.min(creatingSticker.y, cursorPosition.y) - rect.top,
    left: Math.min(creatingSticker.x, cursorPosition.x) - rect.left,
    width: Math.abs(cursorPosition.x - creatingSticker.x),
    height: Math.abs(cursorPosition.y - creatingSticker.y),
  };

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
    const position = { x: event.clientX, y: event.clientY };
    setCreatingSticker(position);
    setCursorPosition(position);
  };

  const stopCreatingSticker = useCallback(() => {
    const styles = newStickerStyleRef.current;
    setCreatingSticker(null);
    setCursorPosition(null);
    addSticker(styles);
  }, [setCreatingSticker, setCursorPosition, addSticker]);

  const continueCreatingSticker = useCallback(event => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  }, []);

  useEffect(() => {
    if (creatingSticker) {
      document.addEventListener('mouseup', stopCreatingSticker);
      document.addEventListener('mousemove', continueCreatingSticker);

      return () => {
        document.removeEventListener('mouseup', stopCreatingSticker);
        document.removeEventListener('mousemove', continueCreatingSticker);
      };
    }
  }, [creatingSticker, stopCreatingSticker, continueCreatingSticker]);

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
      {showStickerCreation && (
        <div className="new-sticker" style={newStickerStyleRef.current}></div>
      )}
      <div ref={dropZoneRef} className={'dropZone' + (isItemInDropZone ? ' active' : '')}>
        Drop zone
      </div>
    </div>
  );
});
