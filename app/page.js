'use client';
import { useState } from 'react';
import TabBar from './components/panels/TabBar';
import EditorPanel from './components/panels/EditorPanel';
import Toolbar from './components/panels/Toolbar';
import SidePanels from './components/panels/SidePanels';
import ResizeHandle from './components/ui/ResizeHandle';
import { useTabs } from './hooks/useTabs';

export default function Page() {
  const [fontSize, setFontSize] = useState(14);
  const [showNotes, setShowNotes] = useState(false);
  const [leftWidth, setLeftWidth] = useState(75);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const { tabs, activeTabId } = useTabs();

  const handleResize = deltaX => {
    const totalWidth = window.innerWidth;
    const deltaPercent = (deltaX / totalWidth) * 100;
    setLeftWidth(prev => Math.min(Math.max(prev + deltaPercent, 50), 85));
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-900 p-2 md:flex-row">
      <div
        style={{ flexBasis: `${leftWidth}%` }}
        className="flex h-[60vh] w-full min-w-0 flex-col md:h-auto"
      >
        <TabBar />
        <EditorPanel />
      </div>
      <ResizeHandle orientation="vertical" onResize={handleResize} className="hidden md:block" />
      <div className="flex min-w-[155px] flex-1 flex-col">
        <Toolbar
          fontSize={fontSize}
          setFontSize={setFontSize}
          showNotes={showNotes}
          setShowNotes={setShowNotes}
          onDownload={() => setIsSaveModalOpen(prev => !prev)}
          isSaveModalOpen={isSaveModalOpen}
        />
        <SidePanels
          showNotes={showNotes}
          isSaveModalOpen={isSaveModalOpen}
          setIsSaveModalOpen={setIsSaveModalOpen}
          tabs={tabs}
          activeTabId={activeTabId}
        />
      </div>
    </main>
  );
}
