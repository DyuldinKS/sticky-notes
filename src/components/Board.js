import { forwardRef, useCallback, useRef } from 'react';
import { Sticker } from './Sticker';

export const Board = forwardRef(function Board({ stickers, setSticker, dropSticker }, ref) {
  const dropZoneRef = useRef();
  const isInDropZone = useCallback((x, y) => {
    if (!dropZoneRef.current) return false;

    const rect = dropZoneRef.current.getBoundingClientRect();
    return rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom;
  }, []);

  return (
    <div ref={ref} className="Board">
      {Object.values(stickers).map(sticker => (
        <Sticker
          key={sticker.id}
          sticker={sticker}
          setSticker={setSticker}
          dropSticker={dropSticker}
          isInDropZone={isInDropZone}
        />
      ))}
      <div ref={dropZoneRef} className="dropZone">
        Drop zone
      </div>
    </div>
  );
});
