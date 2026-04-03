import { Sparkles } from 'lucide-react';
import Panel from '../ui/Panel';
import { useTabs } from '../../hooks/useTabs';

export default function NotesPanel() {
  const { activeTab, updateTabNotes } = useTabs();

  return (
    <Panel
      className="flex-1"
      actions={
        <button className="icon-btn">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      }
    >
      <textarea
        className="h-full w-full resize-none bg-transparent p-2 font-mono text-[14px] whitespace-pre-wrap text-gray-300 outline-none placeholder:text-gray-700"
        placeholder="notes here..."
        value={activeTab?.notes || ''}
        onChange={e => updateTabNotes(e.target.value)}
        spellCheck={false}
      />
    </Panel>
  );
}
