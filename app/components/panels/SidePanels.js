import { useState, useRef, useEffect } from 'react';
import NotesPanel from './NotesPanel';
import InputPanel from './InputPanel';
import OutputPanel from './OutputPanel';
import ResizeHandle from '../ui/ResizeHandle';
import SaveModal from './SaveModal';

export default function SidePanels({
  showNotes,
  isSaveModalOpen,
  setIsSaveModalOpen,
  tabs,
  activeTabId,
}) {
  const [heights, setHeights] = useState(showNotes ? [33.3, 33.3, 33.4] : [0, 50, 50]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!showNotes) {
      setHeights([0, 50, 50]);
    } else {
      setHeights([33.3, 33.3, 33.4]);
    }
  }, [showNotes]);

  const handleResize = (index, deltaY) => {
    if (!containerRef.current) return;
    try {
      const totalHeight = containerRef.current.offsetHeight;
      const minPercent = (28 / totalHeight) * 100;
      const snapPercent = (56 / totalHeight) * 100;
      const deltaPercent = (deltaY / totalHeight) * 100;

      setHeights(prev => {
        const next = [...prev];
        let newI = next[index] + deltaPercent;
        let newNext = next[index + 1] - deltaPercent;
        const isClosingI = deltaPercent < 0;
        const isClosingNext = deltaPercent > 0;

        if (isClosingI && newI < snapPercent) {
          newI = minPercent;
          newNext = next[index] + next[index + 1] - minPercent;
        } else if (isClosingNext && newNext < snapPercent) {
          newNext = minPercent;
          newI = next[index] + next[index + 1] - minPercent;
        }

        if (newI < minPercent || newNext < minPercent) return prev;

        next[index] = newI;
        next[index + 1] = newNext;
        return next;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const visibleHeights = showNotes ? heights : [0, heights[1], heights[2]];

  return (
    <div className="relative flex-1 overflow-hidden">
      {isSaveModalOpen && (
        <div className="absolute inset-0 z-50 flex flex-col bg-gray-900/60 p-0">
          <div
            className="flex w-full flex-col p-0"
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
      {showNotes && (
        <div className="h-full md:hidden">
          <NotesPanel />
        </div>
      )}
      <div
        ref={containerRef}
        className={`${showNotes ? '' : 'md:flex'} hidden h-full md:flex md:flex-col`}
      >
        {showNotes && (
          <>
            <div style={{ flexBasis: `${heights[0]}%` }} className="flex min-h-0 flex-col">
              <NotesPanel />
            </div>
            <ResizeHandle orientation="horizontal" onResize={d => handleResize(0, d)} />
          </>
        )}
        <div
          style={{
            flexBasis: `${showNotes ? heights[1] : (heights[1] / (heights[1] + heights[2])) * 100}%`,
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <InputPanel />
        </div>
        <ResizeHandle orientation="horizontal" onResize={d => handleResize(1, d)} />
        <div
          style={{
            flexBasis: `${showNotes ? heights[2] : (heights[2] / (heights[1] + heights[2])) * 100}%`,
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <OutputPanel />
        </div>
      </div>
    </div>
  );
}
