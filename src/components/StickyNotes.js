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
  console.log(w, h);
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

  const updateSettings = key => event => {
    settingsRef.current[key] = event.target.value;
    logger.log(settingsRef);
  };

  const [stickers, setStickers] = useState({});
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
    setSticker(createSticker(settingsRef.current, boardDimensions));
  }, [setSticker]);

  return (
    <div className="StickyNotes">
      <Controls addSticker={addSticker} updateSettings={updateSettings} />
      <Board ref={boardRef} stickers={stickers} setSticker={setSticker} />
    </div>
  );
};
