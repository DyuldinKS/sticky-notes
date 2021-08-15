import { useEffect, useRef, useState } from 'react';
import { logger } from '../utils';

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
