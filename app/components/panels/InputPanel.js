import { Plus, X } from 'lucide-react';
import Panel from '../ui/Panel';

const autoHeight = el => {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
};

export default function InputPanel({
  testCases,
  addTestCase,
  removeTestCase,
  updateTestCase,
  fontSize = 14,
}) {
  return (
    <Panel
      className="flex-1"
      header="INPUT"
      actions={
        <button className="icon-btn" onClick={addTestCase}>
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      }
    >
      <div className="panel-list">
        {testCases.map(tc => (
          <div key={tc.id} className="group relative flex min-h-[32px] items-start px-2 py-3">
            <textarea
              style={{ fontSize, color: 'var(--text-primary)' }}
              className="w-full resize-none bg-transparent font-mono whitespace-pre-wrap outline-none"
              placeholder="..."
              value={tc.input}
              onChange={e => updateTestCase(tc.id, { input: e.target.value })}
              onInput={e => autoHeight(e.target)}
              ref={autoHeight}
              spellCheck={false}
              rows={1}
            />
            {testCases.length > 1 && (
              <button
                onClick={() => removeTestCase(tc.id)}
                className="icon-btn mt-0.5 ml-1 shrink-0 opacity-0 group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}
