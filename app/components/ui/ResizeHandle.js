import { useState, useEffect, useRef } from 'react';

export default function ResizeHandle({
  orientation = 'vertical',
  onResize,
  className = '',
  isMobileResize,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef(0);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = e => {
      if (e.type === 'touchmove') e.preventDefault();
      const pos = e.touches
        ? orientation === 'vertical'
          ? e.touches[0].clientX
          : e.touches[0].clientY
        : orientation === 'vertical'
          ? e.clientX
          : e.clientY;
      const movement = pos - lastPos.current;
      lastPos.current = pos;
      if (movement !== 0) onResize?.(movement);
    };

    const onUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.pointerEvents = '';
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, orientation, onResize]);

  const handleStart = e => {
    const pos = e.touches
      ? orientation === 'vertical'
        ? e.touches[0].clientX
        : e.touches[0].clientY
      : orientation === 'vertical'
        ? e.clientX
        : e.clientY;
    lastPos.current = pos;
    setIsDragging(true);
    document.body.style.cursor = orientation === 'vertical' ? 'ew-resize' : 'ns-resize';
    document.body.style.pointerEvents = 'none';
  };

  return (
    <div
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      className={`${orientation === 'vertical' ? 'resize-handle-v' : 'resize-handle-h'} group/handle relative z-50 shrink-0 bg-transparent ${className}`}
    >
      {isMobileResize && (
        <div
          className={`absolute z-10 ${orientation === 'vertical' ? 'inset-y-0 -right-1 -left-1' : 'inset-x-0 -top-1 -bottom-1'}`}
        />
      )}
    </div>
  );
}
