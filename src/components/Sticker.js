import { memo } from 'react';

export const Sticker = memo(({ sticker, startDragging, bringToFore }) => {
  const style = {
    left: sticker.position.x,
    top: sticker.position.y,
    width: sticker.size.width,
    height: sticker.size.height,
  };

  return (
    <div onMouseDown={() => bringToFore(sticker.id)} style={style} className="Sticker">
      <div className="draggable" onMouseDown={e => startDragging(sticker.id, e.clientX, e.clientY)}>
        {sticker.id}
      </div>
    </div>
  );
});
