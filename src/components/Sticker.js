import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '../utils';

export const Sticker = memo(({ sticker, onDragStop, setSticker, onMove }) => {
  const initialPosition = useRef(null);
  // Use local position for being able to trigger root state updates only after dragging.
  const [newPosition, setNewPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = useCallback(event => {
    logger.log('start dragging');
    initialPosition.current = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
  }, []);

  const drag = event => {
    const x = sticker.position.x + (event.clientX - initialPosition.current.x);
    const y = sticker.position.y + (event.clientY - initialPosition.current.y);
    setNewPosition({ x, y });
    onMove(event.clientX, event.clientY);
  };

  const stopDragging = event => {
    logger.log('stop dragging:', sticker.id, newPosition);
    setIsDragging(false);
    onDragStop(sticker.id, event.clientX, event.clientY, newPosition);
  };

  useEffect(() => {
    initialPosition.current = null;
  }, [sticker.position]);

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

  const moveUp = () => {
    setSticker({ ...sticker, clickedAt: Date.now() });
  };

  const style = {
    left: newPosition?.x ?? sticker.position.x,
    top: newPosition?.y ?? sticker.position.y,
    width: sticker.size.width,
    height: sticker.size.height,
  };

  return (
    <div onMouseDown={moveUp} style={style} className="Sticker">
      <div className="draggable" onMouseDown={onMouseDown}>
        {sticker.id}
      </div>
    </div>
  );
});
