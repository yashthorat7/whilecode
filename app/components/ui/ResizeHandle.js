import { useState, useEffect } from 'react';

export default function ResizeHandle({ orientation = 'vertical', onResize, className = '' }) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = e => {
      onResize?.(orientation === 'vertical' ? e.movementX : e.movementY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.pointerEvents = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, orientation, onResize]);

  const handleMouseDown = e => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = orientation === 'vertical' ? 'ew-resize' : 'ns-resize';
    document.body.style.pointerEvents = 'none';
  };

  const cls =
    orientation === 'vertical'
      ? 'w-2 cursor-ew-resize self-stretch relative z-50'
      : 'h-2 cursor-ns-resize self-stretch w-full relative z-50';

  return (
    <div onMouseDown={handleMouseDown} className={`shrink-0 bg-transparent ${cls} ${className}`} />
  );
}
