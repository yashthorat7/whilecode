'use client';

export default function TabBar({ tabs, activeTabId, setActiveTabId, addTab, removeTab }) {
  return (
    <div
      role="tablist"
      className="flex h-[36px] overflow-x-auto border-b border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex shrink-0 flex-row flex-nowrap">
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTabId(tab.id)}
              className={`group flex h-full shrink-0 cursor-pointer items-center rounded-t-[6px] px-4 py-0 text-[13px] font-medium transition-all duration-150 ease-in-out ${
                isActive
                  ? 'relative z-10 border-b-transparent bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]'
                  : 'border-b border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
              } `}
            >
              <span className="whitespace-nowrap">{tab.name}</span>
              {tabs.length > 1 && (
                <span
                  className="ml-2 text-[16px] leading-none text-[var(--color-text-secondary)] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[var(--color-error)]"
                  onClick={e => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                >
                  &times;
                </span>
              )}
            </button>
          );
        })}
      </div>
      <button
        onClick={addTab}
        className="h-full shrink-0 cursor-pointer border-none bg-transparent px-3 text-xl text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-accent)]"
        aria-label="Add tab"
      >
        +
      </button>
    </div>
  );
}
