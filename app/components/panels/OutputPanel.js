import Panel from '../ui/Panel';
import { useTabs } from '../../hooks/useTabs';

export default function OutputPanel() {
  const { activeTab } = useTabs();

  if (!activeTab) return <Panel className="flex-1" header="OUTPUT" />;

  return (
    <Panel
      className="flex-1 overflow-hidden"
      header="OUTPUT"
      actions={<span className="font-mono text-[10px] text-gray-500">O(n)</span>}
    >
      <div className="h-full divide-y divide-gray-700 overflow-y-auto select-none">
        {activeTab.testCases.map((tc, index) => (
          <div key={tc.id} className="flex min-h-[32px] items-center px-2 py-4">
            <div
              className={`w-full font-mono text-[14px] whitespace-pre-wrap ${
                tc.output
                  ? tc.status === 'success'
                    ? 'text-emerald-500/80'
                    : tc.status === 'error'
                      ? 'text-rose-500/80'
                      : 'text-gray-300'
                  : 'text-gray-700'
              }`}
            >
              {tc.output || `Output ${index + 1}`}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
