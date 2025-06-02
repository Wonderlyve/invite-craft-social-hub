
import { useCallback, useRef, useState } from 'react';
import Konva from 'konva';

interface UseLongPressOptions {
  onLongPress: () => void;
  onClick?: () => void;
  delay?: number;
}

export const useLongPress = ({ 
  onLongPress, 
  onClick, 
  delay = 500 
}: UseLongPressOptions) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<Konva.Node>();

  const start = useCallback(
    (event: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>) => {
      if (event.target !== target.current) {
        target.current = event.target;
        setLongPressTriggered(false);
      }
      
      timeout.current = setTimeout(() => {
        onLongPress();
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(
    (event: Konva.KonvaEventObject<MouseEvent> | Konva.KonvaEventObject<TouchEvent>, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current);
      
      if (shouldTriggerClick && !longPressTriggered && onClick) {
        onClick();
      }
      
      setLongPressTriggered(false);
    },
    [onClick, longPressTriggered]
  );

  return {
    onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => start(e),
    onTouchStart: (e: Konva.KonvaEventObject<TouchEvent>) => start(e),
    onMouseUp: (e: Konva.KonvaEventObject<MouseEvent>) => clear(e),
    onMouseLeave: (e: Konva.KonvaEventObject<MouseEvent>) => clear(e, false),
    onTouchEnd: (e: Konva.KonvaEventObject<TouchEvent>) => clear(e),
  };
};
