import { useCallback, useEffect, useRef, useState } from 'react';
import { logger } from './logger';
import './StickyNotes.css';

export const generateId = (size = 32) =>
  Array.from(crypto.getRandomValues(new Uint8Array(size)))
    .map(v => v.toString(16).padStart(2, '0'))
    .join('');

const createSticker = ({ width, height, x, y }) => ({
  id: generateId(6),
  style: { width: 200, height: 150, left: 0, top: 0 },
});

export const StickyNotes = () => {
  const settingsRef = useRef({});
  const updateSettings = key => event => {
    settingsRef.current[key] = event.target.value;
    console.log(settingsRef);
  };

  const [stickers, setStickers] = useState({});
  const setSticker = useCallback(
    sticker => {
      setStickers({ ...stickers, [sticker.id]: sticker });
    },
    [stickers]
  );
  const addSticker = useCallback(() => {
    setSticker(createSticker(settingsRef.current));
  }, [setSticker]);

  return (
    <div className="StickyNotes">
      <Controls addSticker={addSticker} updateSettings={updateSettings} />
      <Stickers stickers={stickers} setSticker={setSticker} />
    </div>
  );
};

export const Stickers = ({ stickers, setSticker }) => {
  logger.log('stickers', stickers);
  return (
    <div className="Stickers">
      {Object.values(stickers).map(sticker => (
        <Sticker key={sticker.id} sticker={sticker} setSticker={setSticker} />
      ))}
    </div>
  );
};

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

export const Controls = ({ addSticker, updateSettings }) => (
  <div className="Controls">
    <label>
      Width
      <input type="number" step={10} min={0} onChange={updateSettings('width')} />
    </label>
    <label>
      Height
      <input type="number" step={10} min={0} onChange={updateSettings('height')} />
    </label>
    <label>
      X position
      <input type="number" step={20} min={0} onChange={updateSettings('x')} />
    </label>
    <label>
      Y position
      <input type="number" step={20} min={0} onChange={updateSettings('y')} />
    </label>
    <button onClick={addSticker}>Create</button>
  </div>
);
