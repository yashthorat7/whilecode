import { useState, useRef, useEffect } from "react";
import NotesPanel from "./NotesPanel";
import InputPanel from "./InputPanel";
import OutputPanel from "./OutputPanel";
import ResizeHandle from "../ui/ResizeHandle";

export default function SidePanels({ showNotes }) {
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

      setHeights((prev) => {
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
    <div className="flex-1 overflow-hidden">
      {showNotes && (
        <div className="md:hidden h-full">
          <NotesPanel />
        </div>
      )}
      <div ref={containerRef} className={`${showNotes ? "" : "md:flex"} hidden md:flex md:flex-col h-full`}>
        {showNotes && (
          <>
            <div style={{ flexBasis: `${heights[0]}%` }} className="min-h-0 flex flex-col">
              <NotesPanel />
            </div>
            <ResizeHandle orientation="horizontal" onResize={(d) => handleResize(0, d)} />
          </>
        )}
        <div style={{ flexBasis: `${showNotes ? heights[1] : (heights[1] / (heights[1] + heights[2]) * 100)}%` }} className="min-h-0 flex flex-col flex-1">
          <InputPanel />
        </div>
        <ResizeHandle orientation="horizontal" onResize={(d) => handleResize(1, d)} />
        <div style={{ flexBasis: `${showNotes ? heights[2] : (heights[2] / (heights[1] + heights[2]) * 100)}%` }} className="min-h-0 flex flex-col flex-1">
          <OutputPanel />
        </div>
      </div>
    </div>
  );
}
