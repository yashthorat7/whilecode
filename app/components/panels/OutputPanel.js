import Panel from "../ui/Panel";
import { useTabs } from "../../hooks/useTabs";

export default function OutputPanel() {
  const { activeTab } = useTabs();

  if (!activeTab) return <Panel className="flex-1" header="OUTPUT" />;

  return (
    <Panel
      className="flex-1 overflow-hidden"
      header="OUTPUT"
      actions={<span className="text-[10px] text-gray-500 font-mono">O(n)</span>}
    >
      <div className="h-full overflow-y-auto divide-y divide-gray-700 select-none">
        {activeTab.testCases.map((tc, index) => (
          <div key={tc.id} className="px-2 py-4 flex items-center min-h-[32px]">
            <div className={`w-full text-[14px] font-mono whitespace-pre-wrap ${
              tc.output ? (
                tc.status === 'success' ? 'text-emerald-500/80' :
                tc.status === 'error' ? 'text-rose-500/80' :
                'text-gray-300'
              ) : 'text-gray-700'
            }`}>
              {tc.output || `Output ${index + 1}`}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
