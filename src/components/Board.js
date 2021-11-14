import { useRef } from 'react';
import { Sticker } from './Sticker';
import { useDragging, useDropZone, useLazyMouseListeners, useResizing } from '../hooks';

export const Board = ({ stickers, setSticker, dropSticker, addSticker }) => {
  const boardRef = useRef();
  const dropZoneRef = useRef();
  const dropZoneState = useDropZone(dropZoneRef);
  const boardRect = boardRef.current?.getBoundingClientRect();

  const resizing = useResizing(boardRect, setSticker);
  const dragging = useDragging(boardRect, stickers, setSticker, dropSticker, dropZoneState);

  useLazyMouseListeners(resizing, dragging);

  const createSticker = event => {
    if (event.target !== boardRef.current) return;

    const x = event.clientX;
    const y = event.clientY;
    const newSticker = addSticker({ x, y, width: 0, height: 0 });

    resizing.start(newSticker);
  };

  const bringToFore = id => {
    setSticker({ ...stickers[id], clickedAt: Date.now() });
  };

  return (
    <div ref={boardRef} className="Board" onMouseDown={createSticker}>
      {Object.values(stickers)
        .sort((a, b) => a.clickedAt - b.clickedAt)
        .map(sticker => (
          <Sticker
            key={sticker.id}
            sticker={sticker}
            startDragging={dragging.start}
            bringToFore={bringToFore}
          />
        ))}
      <div
        ref={dropZoneRef}
        className={'dropZone' + (dropZoneState.isItemInDropZone ? ' active' : '')}
      >
        Drop zone
      </div>
    </div>
  );
};
