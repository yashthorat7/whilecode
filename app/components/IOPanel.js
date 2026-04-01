'use client';

import IOBox from '@/app/components/IOBox';
import ResizeHandle from '@/app/components/ResizeHandle';

export default function IOPanel({ 
  testCases, 
  addTestCase, 
  removeTestCase, 
  updateTestCase, 
  ioHeight, 
  startResizeV, 
  globalError 
}) {
  return (
    <div className="flex flex-col h-full w-full bg-bg-surface overflow-hidden">
      <div 
        className="flex flex-col overflow-hidden"
        style={{ height: `${ioHeight}%` }}
      >
        <div className="text-[12px] text-text-secondary font-semibold p-2 uppercase tracking-wider">
          Input
        </div>
        <div className="flex-1 overflow-y-auto px-1">
          {testCases.map((tc, i) => (
            <IOBox
              key={tc.id}
              label={`Case ${i + 1}`}
              value={tc.input}
              status={tc.status}
              onChange={(val) => updateTestCase(tc.id, { input: val })}
              onRemove={testCases.length > 1 ? () => removeTestCase(tc.id) : null}
              readOnly={false}
            />
          ))}
          <div className="p-2">
            <button
              onClick={addTestCase}
              className="text-text-accent text-[12px] font-medium hover:underline transition-all"
            >
               + Add Case
            </button>
          </div>
        </div>
      </div>

      <ResizeHandle onMouseDown={startResizeV} direction="vertical" />

      <div 
        className="flex flex-col overflow-hidden"
        style={{ height: `${100 - ioHeight}%` }}
      >
        <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-border-primary flex items-center justify-between border-b px-3 py-1.5 backdrop-blur-sm">
          <span className="text-secondary text-[11px] font-semibold uppercase tracking-wider">Output</span>
        </div>
        <div className="flex-1 overflow-y-auto p-1.5 [scrollbar-gutter:stable]">
          {globalError && (
            <div className="mb-4 rounded-md border border-[var(--color-error)] bg-[var(--color-bg-elevated)] p-3 shadow-md">
              <div className="mb-1 text-[11px] font-bold text-[var(--color-error)] uppercase">Compilation / Runtime Error</div>
              <pre className="monospace whitespace-pre-wrap text-[12px] text-[var(--color-text-primary)]">
                {globalError}
              </pre>
            </div>
          )}
          <div className="flex flex-col gap-1">
            {testCases.map((tc, i) => (
              <IOBox
                key={tc.id}
                label={`Case ${i + 1}`}
                value={tc.output || ''}
                readOnly
                status={tc.status}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
