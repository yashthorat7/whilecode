'use client';

export default function ResizeHandle({ onMouseDown, direction }) {
  const isHorizontal = direction === 'horizontal';

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
      onMouseDown={onMouseDown}
      className={`
        group relative flex-shrink-0 transition-colors duration-150 hover:bg-[var(--color-bg-hover)]/30
        ${isHorizontal ? 'h-full w-1.5 cursor-col-resize' : 'h-1.5 w-full cursor-row-resize'}
      `}
    >
      <div
        className={`
          absolute inset-0 m-auto bg-[var(--color-border-primary)] transition-colors duration-150 group-hover:bg-[var(--color-border-focus)]
          ${isHorizontal ? 'h-full w-[2px]' : 'h-[2px] w-full'}
        `}
      />
    </div>
  );
}
