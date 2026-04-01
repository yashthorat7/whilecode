'use client';

import { useEffect, useRef } from 'react';

export default function IOBox({ label, value, onChange, status = 'idle', onRemove, readOnly }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [value]);

  const statusColors = {
    idle: { border: 'var(--color-border-primary)', label: 'var(--color-text-primary)' },
    running: { border: 'var(--color-running)', label: 'var(--color-running)' },
    success: { border: 'var(--color-success)', label: 'var(--color-success)' },
    error: { border: 'var(--color-error)', label: 'var(--color-error)' },
    tle: { border: 'var(--color-warning)', label: 'var(--color-warning)' }
  };

  const colors = statusColors[status] || statusColors.idle;

  return (
    <div className="flex flex-col gap-1 p-1 md:p-2">
      <div className="flex items-center justify-between">
        <span 
          className="text-[11px] font-medium transition-colors" 
          style={{ color: colors.label }}
        >
          {label}
        </span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-[14px] leading-none text-text-secondary hover:text-error transition-colors"
          >
            ×
          </button>
        )}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
        className={`
          w-full p-2 rounded-[6px] bg-bg-surface font-mono text-[12px] resize-none overflow-y-auto outline-none transition-all
          ${readOnly ? 'cursor-default bg-bg-surface/50' : 'focus:border-border-focus'}
        `}
        style={{ 
          borderColor: colors.border,
          borderWidth: '1px',
          borderStyle: 'solid',
          minHeight: '40px'
        }}
      />
    </div>
  );
}
