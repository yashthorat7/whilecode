'use client';

import { useState } from 'react';

export default function DocsPanel({ notes, updateNotes, aiAssistant, activeTab }) {
  const { isLoading, error, isOpen, toggleOpen, ask } = aiAssistant;
  const [promptValue, setPromptValue] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!promptValue.trim() || isLoading) return;
    await ask(promptValue, activeTab);
    setPromptValue('');
  };

  return (
    <div className="flex flex-col h-full w-full bg-bg-surface overflow-hidden relative">
      <div className="text-[12px] text-text-secondary font-semibold px-2 py-1 uppercase tracking-wider border-b border-border-primary select-none">
        Notes
      </div>

      <textarea
        value={notes || ''}
        onChange={(e) => updateNotes(e.target.value)}
        placeholder="Write your notes, approach, complexity analysis..."
        spellCheck={false}
        className="flex-1 w-full h-full p-3 font-mono text-[12px] bg-transparent text-text-primary resize-none outline-none overflow-y-auto"
      />

      <div className="absolute bottom-3 right-3 flex flex-col items-end gap-2">
        <div 
          className={`
            flex items-center gap-2 p-1 bg-bg-elevated border border-border-primary rounded-[8px] shadow-lg transition-all duration-200 ease-out
            ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}
          `}
        >
          <input
            type="text"
            value={promptValue}
            onChange={(e) => setPromptValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Ask AI..."
            disabled={isLoading}
            className="w-[180px] sm:w-[220px] bg-transparent text-[12px] px-2 py-1 outline-none text-text-primary disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !promptValue.trim()}
            className="flex items-center justify-center w-[28px] h-[28px] rounded-[6px] bg-text-accent text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              '→'
            )}
          </button>
        </div>

        <div className="relative">
          {error && isOpen && (
            <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap text-error text-[11px] font-medium bg-bg-surface px-2 py-1 rounded border border-error/20 shadow-sm">
              {error}
            </div>
          )}
          <button
            onClick={toggleOpen}
            className={`
              w-[32px] h-[32px] rounded-full bg-bg-elevated border border-border-primary flex items-center justify-center text-text-accent shadow-md transition-all
              ${isOpen ? 'rotate-90' : 'hover:scale-110 hover:bg-bg-hover'}
            `}
          >
            <span className="text-[18px] leading-none mb-0.5">★</span>
          </button>
        </div>
      </div>
    </div>
  );
}
