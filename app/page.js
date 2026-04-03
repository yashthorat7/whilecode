'use client';
import { useState } from 'react';
import TabBar from './components/panels/TabBar';
import EditorPanel from './components/panels/EditorPanel';
import Toolbar from './components/panels/Toolbar';
import SidePanels from './components/panels/SidePanels';
import ResizeHandle from './components/ui/ResizeHandle';
import { useTabs } from './hooks/useTabs';
import { useTheme } from './hooks/useTheme';
import { useCodeExecution } from './hooks/useCodeExecution';
import { useAiAssistant } from './hooks/useAiAssistant';

export default function Page() {
  const [fontSize, setFontSize] = useState(14);
  const [showNotes, setShowNotes] = useState(false);
  const [leftWidth, setLeftWidth] = useState(75);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const {
    tabs,
    activeTabId,
    activeTab,
    setActiveTabId,
    addTab,
    removeTab,
    reorderTabs,
    canAddTab,
    updateTabCode,
    updateTabNotes,
    updateTestCase,
    addTestCase,
    removeTestCase,
    updateActiveTab,
  } = useTabs();
  const { theme, toggleTheme } = useTheme();
  const { run, isRunning, globalError } = useCodeExecution();
  const { ask, isLoading: isAiLoading } = useAiAssistant();

  const handleResize = deltaX => {
    const pct = (deltaX / window.innerWidth) * 100;
    setLeftWidth(prev => Math.min(Math.max(prev + pct, 50), 85));
  };

  const handleAiRefine = async () => {
    if (!activeTab || isAiLoading) return;
    const result = await ask(activeTab.notes || 'Refine this code.', activeTab);
    if (result?.code) updateTabCode(result.code);
    if (result?.notes) updateTabNotes(result.notes);
    if (result?.testCases && Array.isArray(result.testCases)) {
      const mappedTestCases = result.testCases.map(tc => ({
        id: crypto.randomUUID(),
        input: tc.input || '',
        output: tc.output || '',
        status: 'idle',
      }));
      updateActiveTab({ testCases: mappedTestCases });
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-2 md:flex-row">
      <div
        style={{ flexBasis: `${leftWidth}%` }}
        className="flex h-[60vh] w-full min-w-0 flex-col md:h-auto"
      >
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
          addTab={addTab}
          removeTab={removeTab}
          reorderTabs={reorderTabs}
          canAddTab={canAddTab}
        />
        <EditorPanel
          activeTab={activeTab}
          updateTabCode={updateTabCode}
          fontSize={fontSize}
          theme={theme}
          onRun={tab => run(tab, updateTestCase)}
          isRunning={isRunning}
        />
      </div>

      <ResizeHandle orientation="vertical" onResize={handleResize} className="hidden md:block" />

      <div className="flex min-w-[155px] flex-1 flex-col">
        <Toolbar
          fontSize={fontSize}
          setFontSize={setFontSize}
          showNotes={showNotes}
          setShowNotes={setShowNotes}
          onDownload={() => setIsSaveModalOpen(p => !p)}
          isSaveModalOpen={isSaveModalOpen}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <SidePanels
          showNotes={showNotes}
          isSaveModalOpen={isSaveModalOpen}
          setIsSaveModalOpen={setIsSaveModalOpen}
          tabs={tabs}
          activeTabId={activeTabId}
          activeTab={activeTab}
          updateTabNotes={updateTabNotes}
          updateTestCase={updateTestCase}
          addTestCase={addTestCase}
          removeTestCase={removeTestCase}
          globalError={globalError}
          onAiRefine={handleAiRefine}
          isAiLoading={isAiLoading}
          fontSize={fontSize}
        />
      </div>
    </main>
  );
}
