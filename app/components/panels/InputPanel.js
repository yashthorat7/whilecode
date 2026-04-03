import { Plus, X } from 'lucide-react';
import Panel from '../ui/Panel';
export default function InputPanel({ testCases, addTestCase, removeTestCase, updateTestCase }) {
  return (
    <Panel
      className="flex-1 overflow-hidden"
      header="INPUT"
      actions={
        <button className="icon-btn" onClick={addTestCase}>
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      }
    >
      <div className="h-full divide-y divide-gray-700 overflow-y-auto select-none">
        {testCases.map((tc, i) => (
          <div key={tc.id} className="group relative flex min-h-[32px] items-center px-2 py-4">
            <textarea
              className="w-full resize-none overflow-hidden bg-transparent font-mono text-[14px] whitespace-pre-wrap text-gray-300 outline-none placeholder:text-gray-700"
              placeholder={`Test case ${i + 1}`}
              value={tc.input}
              onChange={e => {
                updateTestCase(tc.id, { input: e.target.value });
              }}
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              ref={el => {
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = el.scrollHeight + 'px';
                }
              }}
              spellCheck={false}
              rows={1}
            />
            {testCases.length > 1 && (
              <button
                onClick={() => removeTestCase(tc.id)}
                className="absolute top-1.5 right-1.5 p-1 text-gray-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-gray-400"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

