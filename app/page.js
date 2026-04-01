"use client";

import { useState, useEffect, useRef } from "react";
import { STORAGE_KEYS } from "./utils/constants";
import { useTabs } from "./hooks/useTabs";
import { useLayout } from "./hooks/useLayout";
import { useCodeExecution } from "./hooks/useCodeExecution";
import { useTheme } from "./hooks/useTheme";
import { useAiAssistant } from "./hooks/useAiAssistant";

import { TabBar } from "./components/TabBar";
import { Toolbar } from "./components/Toolbar";
import { EditorPanel } from "./components/EditorPanel";
import { DocsPanel } from "./components/DocsPanel";
import { IOPanel } from "./components/IOPanel";
import { ResizeHandle } from "./components/ResizeHandle";
import { SaveModal } from "./components/SaveModal";

export default function Home() {
  const appRef = useRef(null);
  const rightPanelRef = useRef(null);
  const ioPanelRef = useRef(null);

  const [fontSize, setFontSize] = useState(14);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    if (saved) setFontSize(parseInt(saved, 10));
  }, []);

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, newSize.toString());
  };

  const tabsApi = useTabs();
  const layoutApi = useLayout(appRef, rightPanelRef, ioPanelRef);
  const execApi = useCodeExecution();
  const themeApi = useTheme();
  const aiApi = useAiAssistant();

  const { activeTab, updateActiveTab, updateTabCode, updateTabNotes } = tabsApi;

  return (
    <main
      ref={appRef}
      className="app-grid"
      style={{ "--editor-width": `${layoutApi.editorWidth}%` }}
    >
      <div className="grid-in-tabbar border-r border-border-primary">
        <TabBar
          tabs={tabsApi.tabs}
          activeTabId={activeTab?.id}
          setActiveTabId={tabsApi.setActiveTabId}
          addTab={tabsApi.addTab}
          removeTab={tabsApi.removeTab}
        />
      </div>

      <div className="grid-in-toolbar">
        <Toolbar
          theme={themeApi.theme}
          toggleTheme={themeApi.toggleTheme}
          fontSize={fontSize}
          setFontSize={handleFontSizeChange}
          docsVisible={layoutApi.docsVisible}
          toggleDocs={layoutApi.toggleDocs}
          onSave={() => setIsModalOpen(true)}
          language={activeTab?.language}
          setLanguage={(lang) => tabsApi.updateActiveTab({ language: lang })}
        />
      </div>

      <div className="grid-in-editor relative overflow-hidden">
        <EditorPanel
          code={activeTab?.code}
          language={activeTab?.language}
          theme={themeApi.theme}
          fontSize={fontSize}
          onChange={tabsApi.updateTabCode}
          onRun={() => execApi.run(activeTab, tabsApi.updateTestCase)}
          onSave={() => setIsModalOpen(true)}
          isRunning={execApi.isRunning}
        />
      </div>

      <ResizeHandle direction="horizontal" onMouseDown={layoutApi.startResizeH} />

      <div ref={rightPanelRef} className="grid-in-rightpanel flex flex-col overflow-hidden">
        {layoutApi.docsVisible && (
          <>
            <div className="overflow-auto" style={{ height: `${layoutApi.docsHeight}%` }}>
              <DocsPanel
                notes={activeTab?.notes}
                updateNotes={tabsApi.updateTabNotes}
                aiAssistant={aiApi}
                activeTab={activeTab}
                updateTabCode={tabsApi.updateTabCode}
                updateTabNotes={tabsApi.updateTabNotes}
              />
            </div>
            <ResizeHandle direction="vertical" onMouseDown={layoutApi.startResizeDocs} />
          </>
        )}

        <div ref={ioPanelRef} className="flex-1 overflow-hidden">
          <IOPanel
            testCases={activeTab?.testCases || []}
            addTestCase={tabsApi.addTestCase}
            removeTestCase={tabsApi.removeTestCase}
            updateTestCase={tabsApi.updateTestCase}
            ioHeight={layoutApi.ioHeight}
            startResizeV={layoutApi.startResizeV}
          />
        </div>
      </div>

      <SaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tabs={tabsApi.tabs}
      />

      <style jsx global>{`
        .grid-in-tabbar { grid-area: 1 / 1 / 2 / 2; }
        .grid-in-toolbar { grid-area: 1 / 2 / 2 / 3; }
        .grid-in-editor { grid-area: 2 / 1 / 3 / 2; }
        .grid-in-rightpanel { grid-area: 2 / 2 / 3 / 3; }
      `}</style>
    </main>
  );
}
