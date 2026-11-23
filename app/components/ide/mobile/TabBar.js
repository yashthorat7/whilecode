import { Plus } from 'lucide-react';
import Button from '../../ui/Button';

export default function TabBar({
  activeView,
  setActiveView,
  addTestCase,
  onRun,
  activeTab,
  isRunning,
}) {
  return (
    <div className="relative z-30 flex h-[38px] shrink-0 translate-y-[1px] items-end pr-0.5 select-none">
      <div className="flex h-[38px] min-w-0 items-end gap-[2px]">
        <button
          onClick={() => setActiveView('input')}
          className={`tab ${activeView === 'input' ? 'tab-active' : 'tab-inactive'} !w-24 px-0`}
        >
          <div className="flex w-full items-center justify-center gap-3">
            <span className="tracking-tight">INPUT</span>
            {activeView === 'input' && (
              <div
                onClick={e => {
                  e.stopPropagation();
                  addTestCase();
                }}
                className="mobile-add-btn"
              >
                <Plus className="h-3 w-3" strokeWidth={2.5} />
              </div>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveView('output')}
          className={`tab ${activeView === 'output' ? 'tab-active' : 'tab-inactive'} !w-24 justify-center px-0`}
        >
          <span className="tracking-tight">OUTPUT</span>
        </button>
      </div>

      <div className="ml-4 flex flex-1 -translate-y-1 items-center justify-end gap-2 pb-1 text-zinc-500">
        <button
          className="run-btn !static !translate-x-0 !opacity-100"
          onClick={() => onRun?.(activeTab)}
          disabled={isRunning}
        >
          {isRunning ? '...' : 'Run'}
        </button>

        <Button
          href="https://github.com/yashthorat7"
          target="_blank"
          rel="noopener noreferrer"
          className="flex !h-7 !w-7 !min-w-[28px] items-center justify-center !p-0"
          title="GitHub"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
