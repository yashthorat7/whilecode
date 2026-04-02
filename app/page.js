"use client";
import { useState } from "react";
import TabBar from "./components/panels/TabBar";
import EditorPanel from "./components/panels/EditorPanel";
import Toolbar from "./components/panels/Toolbar";
import SidePanels from "./components/panels/SidePanels";
import ResizeHandle from "./components/ui/ResizeHandle";

export default function Page() {
  const [fontSize, setFontSize] = useState(14);
  const [leftWidth, setLeftWidth] = useState(75);

  const handleResize = (deltaX) => {
    const totalWidth = window.innerWidth;
    const deltaPercent = (deltaX / totalWidth) * 100;
    setLeftWidth((prev) => Math.min(Math.max(prev + deltaPercent, 50), 85));
  };

  return (
    <main className="min-h-screen bg-gray-900 p-2 flex flex-col md:flex-row">
      <div 
        style={{ flexBasis: `${leftWidth}%` }}
        className="h-[60vh] md:h-auto w-full flex flex-col min-w-0"
      >

        <TabBar />
        <EditorPanel />
      </div>
      <ResizeHandle orientation="vertical" onResize={handleResize} className="hidden md:block" />
      <div className="flex-1 flex flex-col min-w-[155px]">

        <Toolbar fontSize={fontSize} setFontSize={setFontSize} />
        <SidePanels />
      </div>
    </main>
  );
}
