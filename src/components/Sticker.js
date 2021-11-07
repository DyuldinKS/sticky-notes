import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '../utils';

export const Sticker = memo(({ sticker, startMoving, bringToFore }) => {
  const style = {
    left: sticker.position.x,
    top: sticker.position.y,
    width: sticker.size.width,
    height: sticker.size.height,
  };

  return (
    <div onMouseDown={() => bringToFore(sticker.id)} style={style} className="Sticker">
      <div className="draggable" onMouseDown={e => startMoving(sticker.id, e.clientX, e.clientY)}>
        {sticker.id}
      </div>
    </div>
  );
});
