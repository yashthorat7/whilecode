import Panel from '../ui/Panel';

const STATUS_CLASS = {
  success: 'output-success',
  error: 'output-error',
  running: 'output-running',
};

export default function OutputPanel({ testCases, globalError, complexity, fontSize = 14 }) {
  return (
    <Panel
      className="flex-1"
      header="OUTPUT"
      actions={<span className="header-badge">{complexity || '-- --'}</span>}
    >
      <div className="panel-list select-text">
        {globalError && (
          <div
            className="px-[0.5em] py-[0.75em]"
            style={{ fontSize, color: 'var(--c-error)', fontFamily: 'inherit' }}
          >
            <span style={{ fontWeight: 700 }}>Error: </span>
            {globalError}
          </div>
        )}
        {testCases.map(tc => (
          <div key={tc.id} className="flex min-h-[2.2em] items-start px-[0.5em] py-[0.75em]">
            <div
              style={{ fontSize }}
              className={`w-full font-mono whitespace-pre-wrap ${STATUS_CLASS[tc.status] || 'output-idle'}`}
            >
              {tc.output || '...'}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
