import { forwardRef, useCallback, useRef } from 'react';
import { logger } from '../utils';
import { Sticker } from './Sticker';

export const Board = forwardRef(function Board({ stickers, setSticker, dropSticker }, ref) {
  logger.log('stickers', stickers);
  const dropZoneRef = useRef();
  const isInDropZone = useCallback((x, y) => {
    if (!dropZoneRef.current) return false;

    const rect = dropZoneRef.current.getBoundingClientRect();
    console.log('is in drop zone, x y', x, y);
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
