import { useCallback, useState } from 'react';
import { generateId, logger } from '../utils';
import { Board } from './Board';

const createSticker = ({ x, y, width, height }) => ({
  id: generateId(6),
  clickedAt: Date.now(),
  options: { x, y, width, height },
});

export const StickyNotes = () => {
  const [stickers, setStickers] = useState({});

  const setSticker = useCallback(sticker => {
    setStickers(stickers => ({ ...stickers, [sticker.id]: sticker }));
  }, []);

  const addSticker = useCallback(
    options => {
      const newSticker = createSticker(options);
      logger.log('add sticker:', newSticker);
      setSticker(newSticker);
    },
    [setSticker]
  );

  const dropSticker = useCallback(id => {
    setStickers(stickers => {
      logger.log('drop sticker:', id);
      const { [id]: stickerToDrop, ...rest } = stickers;
      return rest;
    });
  }, []);

  return (
    <div className="StickyNotes">
      <Board
        stickers={stickers}
        setSticker={setSticker}
        dropSticker={dropSticker}
        addSticker={addSticker}
      />
    </div>
  );
};
