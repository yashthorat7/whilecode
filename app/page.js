'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { STORAGE_KEYS } from '@/app/utils/constants';
import { useTabs } from '@/app/hooks/useTabs';
import { useLayout } from '@/app/hooks/useLayout';
import { useCodeExecution } from '@/app/hooks/useCodeExecution';
import { useTheme } from '@/app/hooks/useTheme';
import { useAiAssistant } from '@/app/hooks/useAiAssistant';

import TabBar from '@/app/components/TabBar';
import Toolbar from '@/app/components/Toolbar';
import EditorPanel from '@/app/components/EditorPanel';
import DocsPanel from '@/app/components/DocsPanel';
import IOPanel from '@/app/components/IOPanel';
import ResizeHandle from '@/app/components/ResizeHandle';
import SaveModal from '@/app/components/SaveModal';

export default function Home() {
  const appRef = useRef(null);
  const rightPanelRef = useRef(null);
  const ioPanelRef = useRef(null);

  const [fontSize, setFontSize] = useState(14);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabsApi = useTabs();
  const layoutApi = useLayout(appRef, rightPanelRef, ioPanelRef);
  const execApi = useCodeExecution();
  const themeApi = useTheme();
  const aiApi = useAiAssistant();

  const activeTab = tabsApi.activeTab;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    if (saved) setFontSize(parseInt(saved, 10));

    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, newSize.toString());
  };

  const handleAiAsk = async (prompt, tab) => {
    const response = await aiApi.ask(prompt, tab);
    if (response) {
      if (response.changeType === 'code' && response.code) {
        tabsApi.updateTabCode(response.code);
      } else if (response.changeType === 'notes' && response.notes) {
        tabsApi.updateTabNotes(response.notes);
      } else if (response.changeType === 'both') {
        if (response.code) tabsApi.updateTabCode(response.code);
        if (response.notes) tabsApi.updateTabNotes(response.notes);
      }
    }
    return response;
  };

  return (
    <>
      <div className="mobile-banner">
        <h1 className="mb-4 text-2xl font-bold text-[var(--color-text-accent)]">WHILECODE</h1>
        <p className="text-[var(--color-text-secondary)]">
          WHILECODE is optimized for desktop environments.<br />
          Please use a larger screen to access the IDE.
        </p>
      </div>

      <main
        ref={appRef}
        className="app-grid"
        style={{ '--editor-width': `${layoutApi.editorWidth}%` }}
      >
      <div className="grid-in-tabbar border-border-primary border-r overflow-hidden">
        <TabBar
          tabs={tabsApi.tabs}
          activeTabId={tabsApi.activeTabId}
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
          setLanguage={tabsApi.updateTabLanguage}
        />
      </div>

      <div className="grid-in-editor relative overflow-hidden backdrop-blur-sm">
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
            <div 
              className="overflow-hidden relative" 
              style={{ height: `${layoutApi.docsHeight}%` }}
            >
              <DocsPanel
                notes={activeTab?.notes}
                updateNotes={tabsApi.updateTabNotes}
                aiAssistant={{ ...aiApi, ask: handleAiAsk }}
                activeTab={activeTab}
              />
            </div>
            <ResizeHandle direction="vertical" onMouseDown={layoutApi.startResizeDocs} />
          </>
        )}

        <div ref={ioPanelRef} className="flex-1 overflow-hidden min-h-0">
          <IOPanel
            testCases={activeTab?.testCases || []}
            addTestCase={tabsApi.addTestCase}
            removeTestCase={tabsApi.removeTestCase}
            updateTestCase={tabsApi.updateTestCase}
            ioHeight={layoutApi.ioHeight}
            startResizeV={layoutApi.startResizeV}
            globalError={execApi.globalError}
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
    </>
  );
}
