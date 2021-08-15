import { forwardRef } from 'react';
import { logger } from '../utils';
import { Sticker } from './Sticker';

export const Board = forwardRef(function Board({ stickers, setSticker }, ref) {
  logger.log('stickers', stickers);
  return (
    <div ref={ref} className="Board">
      {Object.values(stickers).map(sticker => (
        <Sticker key={sticker.id} sticker={sticker} setSticker={setSticker} />
      ))}
    </div>
  );
});
