import { Plus, X } from "lucide-react";
import Panel from "../ui/Panel";
import { useTabs } from "../../hooks/useTabs";

export default function InputPanel() {
  const { activeTab, addTestCase, removeTestCase, updateTestCase } = useTabs();

  if (!activeTab) return <Panel className="flex-1" header="INPUT" />;

  return (
    <Panel
      className="flex-1 overflow-hidden"
      header="INPUT"
      actions={
        <button className="icon-btn" onClick={addTestCase}>
          <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      }
    >
      <div className="h-full overflow-y-auto divide-y divide-gray-700 select-none">
        {activeTab.testCases.map((tc, i) => (
          <div key={tc.id} className="group relative px-2 py-4 flex items-center min-h-[32px]">
            <textarea
              className="w-full bg-transparent outline-none resize-none text-[14px] font-mono text-gray-300 placeholder:text-gray-700 whitespace-pre-wrap overflow-hidden"
              placeholder={`Test case ${i + 1}`}
              value={tc.input}
              onChange={(e) => {
                updateTestCase(tc.id, { input: e.target.value });
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              ref={(el) => {
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = el.scrollHeight + 'px';
                }
              }}
              spellCheck={false}
              rows={1}
            />
            {activeTab.testCases.length > 1 && (
              <button 
                onClick={() => removeTestCase(tc.id)}
                className="absolute top-1.5 right-1.5 p-1 text-gray-600 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}
