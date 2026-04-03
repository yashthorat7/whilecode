import { Sparkles } from 'lucide-react';
import Panel from '../ui/Panel';

export default function NotesPanel({ notes, updateNotes, onAiRefine, isAiLoading, fontSize = 14 }) {
  return (
    <Panel
      className="flex-1"
      actions={
        <button
          className="icon-btn"
          onClick={onAiRefine}
          disabled={isAiLoading}
          style={isAiLoading ? { color: 'var(--text-accent)' } : undefined}
        >
          <Sparkles
            className={`h-3.5 w-3.5 ${isAiLoading ? 'animate-spin' : ''}`}
            strokeWidth={1.5}
          />
        </button>
      }
    >
      <textarea
        style={{ fontSize, color: 'var(--text-primary)' }}
        className="h-full w-full resize-none bg-transparent p-2 font-mono whitespace-pre-wrap outline-none"
        placeholder="Notes..."
        value={notes || ''}
        onChange={e => updateNotes(e.target.value)}
        spellCheck={false}
      />
    </Panel>
  );
}
