import Panel from '../ui/Panel';

export default function OutputPanel({ testCases, globalError }) {
  return (
    <Panel
      className="flex-1 overflow-hidden"
      header="OUTPUT"
      actions={<span className="font-mono text-[10px] text-gray-500">O(n)</span>}
    >
      <div className="h-full divide-y divide-gray-700 overflow-y-auto select-none">
        {globalError && (
          <div className="px-3 py-4">
            <div className="font-mono text-[13px] text-rose-500">
              <span className="font-bold uppercase">Error:</span> {globalError}
            </div>
          </div>
        )}
        {testCases.map((tc, index) => (
          <div key={tc.id} className="flex min-h-[32px] items-center px-2 py-4">
            <div
              className={`w-full font-mono text-[14px] whitespace-pre-wrap ${
                tc.status === 'success'
                  ? 'text-emerald-500/80'
                  : tc.status === 'error'
                    ? 'text-rose-500/80'
                    : tc.status === 'running'
                      ? 'text-gray-500 animate-pulse'
                      : 'text-gray-700'
              }`}
            >
              {tc.output || (tc.status === 'running' ? '...' : '')}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

