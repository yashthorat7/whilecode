export const ResizeHandle = ({ direction }) => (
  <div
    className={`bg-bg-hover hover:bg-border-focus transition-colors ${
      direction === 'horizontal' ? 'w-1.5 h-full cursor-col-resize' : 'h-1.5 w-full cursor-row-resize'
    }`}
  />
);
