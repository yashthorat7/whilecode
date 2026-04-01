'use client';

export default function LanguageSelector({ language, setLanguage }) {
  return (
    <div className="flex overflow-hidden rounded-[6px] border border-[var(--color-border-primary)]">
      <button
        onClick={() => setLanguage('c')}
        className={`px-3 py-1 text-[12px] transition-all duration-150 ${
          language === 'c'
            ? 'bg-[var(--color-bg-elevated)] font-semibold text-[var(--color-text-accent)]'
            : 'bg-transparent text-[var(--color-text-secondary)]'
        }`}
      >
        C
      </button>
      <button
        onClick={() => setLanguage('cpp')}
        className={`px-3 py-1 text-[12px] transition-all duration-150 ${
          language === 'cpp'
            ? 'bg-[var(--color-bg-elevated)] font-semibold text-[var(--color-text-accent)]'
            : 'bg-transparent text-[var(--color-text-secondary)]'
        }`}
      >
        C++
      </button>
    </div>
  );
}
