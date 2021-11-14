import { memo } from 'react';

export const Sticker = memo(({ sticker, startDragging, startResizing, bringToFore }) => {
  const style = {
    left: sticker.position.x,
    top: sticker.position.y,
    width: sticker.size.width,
    height: sticker.size.height,
  };

  return (
    <div onMouseDown={() => bringToFore(sticker)} style={style} className="Sticker">
      <div className="draggable" onMouseDown={e => startDragging(sticker, e.clientX, e.clientY)}>
        {sticker.id}
      </div>
      <div onMouseDown={() => startResizing(sticker)} className="resizeCorner"></div>
    </div>
  );
});
