import { useState, useRef } from "react";
import NotesPanel from "./NotesPanel";
import InputPanel from "./InputPanel";
import OutputPanel from "./OutputPanel";
import ResizeHandle from "../ui/ResizeHandle";

export default function SidePanels() {
  const [heights, setHeights] = useState([33.3, 33.3, 33.4]);
  const containerRef = useRef(null);

  const handleResize = (index, deltaY) => {
    if (!containerRef.current) return;
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
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="md:hidden h-full">
        <NotesPanel />
      </div>
      <div ref={containerRef} className="hidden md:flex md:flex-col h-full">
        <div style={{ flexBasis: `${heights[0]}%` }} className="min-h-0 flex flex-col">
          <NotesPanel />
        </div>
        <ResizeHandle orientation="horizontal" onResize={(d) => handleResize(0, d)} />
        <div style={{ flexBasis: `${heights[1]}%` }} className="min-h-0 flex flex-col">
          <InputPanel />
        </div>
        <ResizeHandle orientation="horizontal" onResize={(d) => handleResize(1, d)} />
        <div style={{ flexBasis: `${heights[2]}%` }} className="min-h-0 flex flex-col flex-1">
          <OutputPanel />
        </div>
      </div>
    </div>
  );
}
