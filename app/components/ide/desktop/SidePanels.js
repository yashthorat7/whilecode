import { useState, useRef, useEffect } from 'react';
import NotesPanel from './NotesPanel';
import InputPanel from './InputPanel';
import OutputPanel from './OutputPanel';
import ResizeHandle from '../../ui/ResizeHandle';
import SaveModal from './SaveModal';

export default function SidePanels({
  showNotes,
  isSaveModalOpen,
  setIsSaveModalOpen,
  tabs,
  activeTabId,
  activeTab,
  updateTabNotes,
  updateTestCase,
  addTestCase,
  removeTestCase,
  globalError,
  onAiAction,
  loadingAction,
  complexity,
  fontSize,
}) {
  const [heights, setHeights] = useState(showNotes ? [33.3, 33.3, 33.4] : [0, 50, 50]);
  const containerRef = useRef(null);

  useEffect(() => {
    setHeights(showNotes ? [33.3, 33.3, 33.4] : [0, 50, 50]);
  }, [showNotes]);

  const handleResize = (index, deltaY) => {
    if (!containerRef.current) return;
    const totalHeight = containerRef.current.offsetHeight;
    if (totalHeight <= 0) return;

    const minPx = 28;
    const snapPx = 72;
    const minPercent = (minPx / totalHeight) * 100;
    const snapPercent = (snapPx / totalHeight) * 100;
    const deltaPercent = (deltaY / totalHeight) * 100;

    setHeights(prev => {
      const next = [...prev];
      let newI = next[index] + deltaPercent;
      let newNext = next[index + 1] - deltaPercent;

      if (deltaPercent < 0 && newI < snapPercent) {
        newI = minPercent;
        newNext = next[index] + next[index + 1] - minPercent;
      } else if (deltaPercent > 0 && newNext < snapPercent) {
        newNext = minPercent;
        newI = next[index] + next[index + 1] - minPercent;
      }

      if (newI < minPercent || newNext < minPercent) return prev;
      next[index] = newI;
      next[index + 1] = newNext;
      return next;
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      const totalHeight = containerRef.current?.offsetHeight || 0;
      if (totalHeight <= 0) return;

      const minPercent = (32 / totalHeight) * 100;
      setHeights(prev => {
        const next = [...prev];
        let changed = false;

        for (let i = 0; i < next.length; i++) {
          if (next[i] > 0 && next[i] < minPercent) {
            next[i] = minPercent;
            changed = true;
          }
        }

        if (changed) {
          const sum = next.reduce((a, b) => a + b, 0);
          return next.map(h => (h / sum) * 100);
        }
        return prev;
      });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden">
      {isSaveModalOpen && (
        <div className="modal-overlay">
          <div
            className="flex w-full flex-col"
            style={{ height: showNotes ? `${Math.max(heights[0], 30)}%` : '33.33%' }}
          >
            <SaveModal
              tabs={tabs}
              activeTabId={activeTabId}
              onClose={() => setIsSaveModalOpen(false)}
            />
          </div>
        </div>
      )}
      <div ref={containerRef} className="hidden h-full md:flex md:flex-col">
        {showNotes && (
          <>
            <div
              style={{ flex: `${heights[0]} ${heights[0]} 0px` }}
              className="flex min-h-0 flex-col"
            >
              <NotesPanel
                notes={activeTab?.notes}
                updateNotes={updateTabNotes}
                onAiAction={onAiAction}
                loadingAction={loadingAction}
                fontSize={fontSize}
              />
            </div>
            <ResizeHandle orientation="horizontal" onResize={d => handleResize(0, d)} />
          </>
        )}
        <div style={{ flex: `${heights[1]} ${heights[1]} 0px` }} className="flex min-h-0 flex-col">
          <InputPanel
            testCases={activeTab?.testCases || []}
            addTestCase={addTestCase}
            removeTestCase={removeTestCase}
            updateTestCase={updateTestCase}
            fontSize={fontSize}
          />
        </div>
        <ResizeHandle orientation="horizontal" onResize={d => handleResize(1, d)} />
        <div style={{ flex: `${heights[2]} ${heights[2]} 0px` }} className="flex min-h-0 flex-col">
          <OutputPanel
            testCases={activeTab?.testCases || []}
            globalError={globalError}
            complexity={complexity}
            fontSize={fontSize}
          />
        </div>
      </div>
    </div>
  );
}
