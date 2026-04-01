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
        <div className="text-[12px] text-text-secondary font-semibold p-2 uppercase tracking-wider">
          Output
        </div>
        <div className="flex-1 overflow-y-auto px-1">
          {globalError ? (
            <div className="p-2 font-mono text-[12px] text-error whitespace-pre-wrap">
              {globalError}
            </div>
          ) : (
            testCases.map((tc, i) => (
              <IOBox
                key={tc.id}
                label={`Case ${i + 1}`}
                value={tc.output || ''}
                status={tc.status}
                readOnly={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
