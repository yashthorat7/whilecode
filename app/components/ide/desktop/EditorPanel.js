import Panel from '../../ui/Panel';
import CodeEditor from '../CodeEditor';

export default function EditorPanel({
  activeTab,
  updateTabCode,
  fontSize,
  theme,
  onRun,
  isRunning,
}) {
  if (!activeTab) return <Panel className="relative z-10 -mt-px flex-1 rounded-tl-none" />;

  return (
    <Panel className="relative z-10 flex-1 overflow-hidden rounded-tl-none p-0">
      <CodeEditor
        value={activeTab.code}
        language={activeTab.language}
        theme={theme}
        fontSize={fontSize}
        onChange={updateTabCode}
      />
      <div className="absolute top-2 right-2 z-20">
        <button className="run-btn" onClick={() => onRun(activeTab)} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>
    </Panel>
  );
}
