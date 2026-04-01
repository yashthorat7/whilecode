'use client';

import { FONT_SIZE_RANGE } from '@/app/utils/constants';
import LanguageSelector from './LanguageSelector';

export default function Toolbar({
  theme,
  toggleTheme,
  fontSize,
  setFontSize,
  docsVisible,
  toggleDocs,
  onSave,
  language,
  setLanguage,
}) {
  const iconButtonStyle =
    'flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--color-text-secondary)] transition-all duration-150 hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] cursor-pointer';

  return (
    <div className="flex h-[36px] items-center justify-end gap-2 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-3">
      <LanguageSelector language={language} setLanguage={setLanguage} />

      <button
        onClick={toggleDocs}
        className={iconButtonStyle}
        aria-label="Toggle documentation panel"
      >
        <span className="text-sm">≡</span>
      </button>

      <button onClick={onSave} className={iconButtonStyle} aria-label="Save solutions">
        <span className="text-sm">⬇</span>
      </button>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setFontSize(fontSize - 1)}
          disabled={fontSize <= FONT_SIZE_RANGE.min}
          className={`${iconButtonStyle} ${fontSize <= FONT_SIZE_RANGE.min ? 'pointer-events-none opacity-50' : ''}`}
        >
          −
        </button>
        <span className="w-6 text-center text-[12px] text-[var(--color-text-secondary)]">
          {fontSize}
        </span>
        <button
          onClick={() => setFontSize(fontSize + 1)}
          disabled={fontSize >= FONT_SIZE_RANGE.max}
          className={`${iconButtonStyle} ${fontSize >= FONT_SIZE_RANGE.max ? 'pointer-events-none opacity-50' : ''}`}
        >
          +
        </button>
      </div>

      <button
        onClick={toggleTheme}
        className={iconButtonStyle}
        aria-label="Switch to light/dark mode"
      >
        <span className="text-base">{theme === 'dark' ? '☀' : '🌙'}</span>
      </button>
    </div>
  );
}
