import { useCallback, useRef, useState } from 'react';
import { BOARD_OFFSET, STICKER_SIZE } from '../constants';
import { fitIntoInterval, generateId, logger } from '../utils';
import { Board } from './Board';
import { Controls } from './Controls';

const createSticker = ({ width, height, x, y }, board) => {
  const maxWidth = Math.max(STICKER_SIZE.minWidth, board.width / 4);
  const maxHeight = Math.max(STICKER_SIZE.minHeight, board.height / 4);
  const w = fitIntoInterval(STICKER_SIZE.minWidth, maxWidth, width);
  const h = fitIntoInterval(STICKER_SIZE.minHeight, maxHeight, height);

  return {
    id: generateId(6),
    style: {
      width: w,
      height: h,
      left: fitIntoInterval(BOARD_OFFSET, board.width - w - BOARD_OFFSET, x),
      top: fitIntoInterval(BOARD_OFFSET, board.height - h - BOARD_OFFSET, y),
    },
  };
};

export const StickyNotes = () => {
  const settingsRef = useRef({});
  const boardRef = useRef();
  const [stickers, setStickers] = useState({});

  const updateSettings = useCallback(
    key => event => {
      settingsRef.current[key] = event.target.value;
      logger.log(settingsRef);
    },
    []
  );

  const setSticker = useCallback(
    sticker => {
      setStickers({ ...stickers, [sticker.id]: sticker });
    },
    [stickers]
  );

  const addSticker = useCallback(() => {
    const boardDimensions = {
      width: boardRef.current.clientWidth,
      height: boardRef.current.clientHeight,
    };
    const newSticker = createSticker(settingsRef.current, boardDimensions);
    logger.log('add sticker:', newSticker);
    setSticker(newSticker);
  }, [setSticker]);

  const dropSticker = useCallback(
    id => {
      logger.log('drop sticker:', id);
      const { [id]: stickerToDrop, ...rest } = stickers;
      setStickers(rest);
    },
    [stickers]
  );

  return (
    <div className="StickyNotes">
      <Controls addSticker={addSticker} updateSettings={updateSettings} />
      <Board ref={boardRef} stickers={stickers} setSticker={setSticker} dropSticker={dropSticker} />
    </div>
  );
};
