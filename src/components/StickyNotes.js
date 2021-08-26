import { useCallback, useState } from 'react';
import { generateId, logger } from '../utils';
import { Board } from './Board';

const createSticker = style => ({
  id: generateId(6),
  clickedAt: Date.now(),
  style,
});

export const StickyNotes = () => {
  const [stickers, setStickers] = useState({});

  const setSticker = useCallback(sticker => {
    setStickers(stickers => ({ ...stickers, [sticker.id]: sticker }));
  }, []);

  const addSticker = useCallback(
    style => {
      const newSticker = createSticker(style);
      logger.log('add sticker:', newSticker);
      setSticker(newSticker);
    },
    [setSticker]
  );

  const dropSticker = useCallback(id => {
    logger.log('drop sticker:', id);
    setStickers(stickers => {
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
