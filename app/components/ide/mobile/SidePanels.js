import Panel from '../../ui/Panel';
import TabBar from './TabBar';
import InputPanel from './InputPanel';
import OutputPanel from './OutputPanel';

export default function MobileSidePanels({
  testCases,
  addTestCase,
  removeTestCase,
  updateTestCase,
  globalError,
  activeTab,
  complexity,
  fontSize = 14,
  onRun,
  isRunning,
  activeView,
  setActiveView,
  onResetOutput,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <TabBar
        activeView={activeView}
        setActiveView={setActiveView}
        addTestCase={addTestCase}
        onRun={onRun}
        activeTab={activeTab}
        isRunning={isRunning}
        onResetOutput={onResetOutput}
      />

      <Panel className="min-h-0 flex-1 overflow-hidden rounded-tl-none pb-0">
        {activeView === 'input' ? (
          <InputPanel
            testCases={testCases}
            removeTestCase={removeTestCase}
            updateTestCase={updateTestCase}
            fontSize={fontSize}
          />
        ) : (
          <OutputPanel testCases={testCases} globalError={globalError} fontSize={fontSize} />
        )}
      </Panel>
    </div>
  );
}
