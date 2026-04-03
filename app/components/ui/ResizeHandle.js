import { useState, useEffect } from 'react';

export default function ResizeHandle({ orientation = 'vertical', onResize, className = '' }) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = e => onResize?.(orientation === 'vertical' ? e.movementX : e.movementY);
    const onUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.pointerEvents = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, orientation, onResize]);

  const handleMouseDown = e => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = orientation === 'vertical' ? 'ew-resize' : 'ns-resize';
    document.body.style.pointerEvents = 'none';
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`${orientation === 'vertical' ? 'resize-handle-v' : 'resize-handle-h'} ${className}`}
    />
  );
}
