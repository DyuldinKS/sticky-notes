import { useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '../utils';

export const Sticker = ({ sticker, setSticker, dropSticker, isInDropZone }) => {
  const initialPosition = useRef(null);
  // Use local position for being able to trigger root state updates only after dragging.
  const [styleOverride, setStyleOverride] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = useCallback(event => {
    logger.log('start dragging');
    initialPosition.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
  }, []);

  const drag = event => {
    const left = sticker.style.left + (event.clientX - initialPosition.current.x);
    const top = sticker.style.top + (event.clientY - initialPosition.current.y);
    setStyleOverride({ left, top });
  };

  const stopDragging = event => {
    logger.log('stop dragging:', sticker.id, styleOverride);
    setIsDragging(false);
    if (isInDropZone(event.clientX, event.clientY)) {
      dropSticker(sticker.id);
    } else {
      setSticker({ ...sticker, style: newStyle });
    }
  };

  useEffect(() => {
    logger.log('external sticker update:', sticker);
    initialPosition.current = null;
  }, [sticker]);

  // wrapping handlers into the ref allows us use them in the effect below without defining them as dependencies
  const handlersRef = useRef();
  handlersRef.current = { stopDragging, drag };

  useEffect(() => {
    if (isDragging) {
      // Can't use onMouseUp, onMouseMove JSX handlers, since when cursor goes out from the element these events aren't fired.
      const onMouseMove = event => handlersRef.current?.drag(event);
      const onMouseUp = event => handlersRef.current?.stopDragging(event);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      return () => {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
      };
    }
  }, [isDragging]);

  const newStyle = { ...sticker.style, ...styleOverride };

  return (
    <div style={newStyle} className="Sticker">
      <div className="draggable" onMouseDown={onMouseDown}>
        {sticker.id}
      </div>
    </div>
  );
};
