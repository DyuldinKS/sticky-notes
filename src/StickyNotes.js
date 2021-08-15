import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { logger } from './logger';
import './StickyNotes.css';

export const generateId = (size = 32) =>
  Array.from(crypto.getRandomValues(new Uint8Array(size)))
    .map(v => v.toString(16).padStart(2, '0'))
    .join('');

const BOARD_OFFSET = 16;
const STICKER_SIZE = {
  minWidth: 200,
  minHeight: 160,
};

const castToInterval = (min, max, val) => (val ? Math.max(min, Math.min(max, val)) : min);

const createSticker = ({ width, height, x, y }, board) => {
  const maxWidth = Math.max(STICKER_SIZE.minWidth, board.width / 4);
  const maxHeight = Math.max(STICKER_SIZE.minHeight, board.height / 4);
  const w = castToInterval(STICKER_SIZE.minWidth, maxWidth, width);
  const h = castToInterval(STICKER_SIZE.minHeight, maxHeight, height);
  console.log(w, h);
  return {
    id: generateId(6),
    style: {
      width: w,
      height: h,
      left: castToInterval(BOARD_OFFSET, board.width - w - BOARD_OFFSET, x),
      top: castToInterval(BOARD_OFFSET, board.height - h - BOARD_OFFSET, y),
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

export const usePrevious = (value, initial = null) => {
  const previous = useRef(initial);
  useEffect(() => {
    previous.current = value;
  }, [value]);
  return previous.current;
};

export const Sticker = ({ sticker, setSticker }) => {
  const initialPosition = useRef(null);
  // Use local position override for being able to trigger root state updates only after dragging.
  const [styleOverride, setStyleOverride] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = event => {
    logger.log('start dragging');
    initialPosition.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
  };

  const onMouseMove = event => {
    const left = sticker.style.left + (event.clientX - initialPosition.current.x);
    const top = sticker.style.top + (event.clientY - initialPosition.current.y);
    setStyleOverride({ left, top });
  };

  const stopDragging = () => {
    logger.log('stop dragging:', styleOverride);
    setIsDragging(false);
    setSticker({
      ...sticker,
      style: { ...sticker.style, ...styleOverride },
    });
  };

  const stopDraggingRef = useRef();
  stopDraggingRef.current = stopDragging;

  useEffect(() => {
    logger.log('external sticker update:', sticker);
    initialPosition.current = null;
  }, [sticker]);

  useEffect(() => {
    if (isDragging) {
      // if we use onMouseUp handler in jsx the mouseup event doesn't happen, when cursor goes out from the element.
      // TODO: use global mousedown and mousemove events to be able to move a sticker when cursor is outside.
      const onMouseUp = () => stopDraggingRef.current?.();
      document.addEventListener('mouseup', onMouseUp);
      return () => document.removeEventListener('mouseup', onMouseUp);
    }
  }, [isDragging]);

  const newStyle = { ...sticker.style, ...styleOverride };

  return (
    <div style={newStyle} className="Sticker" {...(isDragging ? { onMouseMove } : null)}>
      <div className="draggable" onMouseDown={onMouseDown}>
        {sticker.id}
      </div>
    </div>
  );
};

const renderControl = (label, step, min, onChange, props) => (
  <label>
    {label}
    <input type="number" step={step} min={min} onChange={onChange} {...props} />
  </label>
);

export const Controls = ({ addSticker, updateSettings }) => (
  <div className="Controls">
    {renderControl('Width', 10, STICKER_SIZE.minWidth, updateSettings('width'))}
    {renderControl('Height', 10, STICKER_SIZE.minHeight, updateSettings('height'))}
    {renderControl('X position', 10, 0, updateSettings('x'))}
    {renderControl('Y position', 10, 0, updateSettings('y'))}
    <button onClick={addSticker}>Create</button>
  </div>
);
