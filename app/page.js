"use client";
import { useState } from "react";
import TabBar from "./components/panels/TabBar";
import EditorPanel from "./components/panels/EditorPanel";
import Toolbar from "./components/panels/Toolbar";
import SidePanels from "./components/panels/SidePanels";
import ResizeHandle from "./components/ui/ResizeHandle";

export default function Page() {
  const [fontSize, setFontSize] = useState(14);

  return (
    <main className="min-h-screen bg-gray-900 p-2 flex flex-col md:flex-row">
      <div className="h-[60vh] md:h-auto w-full md:w-[65%] lg:w-[80%] flex flex-col">
        <TabBar />
        <EditorPanel />
      </div>
      <ResizeHandle orientation="vertical" />
      <div className="flex-1 flex flex-col">
        <Toolbar fontSize={fontSize} setFontSize={setFontSize} />
        <SidePanels />
      </div>
    </main>
  );
}
