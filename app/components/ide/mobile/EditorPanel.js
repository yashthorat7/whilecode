import Panel from '../../ui/Panel';
import CodeEditor from '../CodeEditor';

export default function MobileEditorPanel({ activeTab, updateTabCode, fontSize, theme }) {
  if (!activeTab) return <Panel className="h-full flex-1 overflow-hidden rounded-b-xl" />;

  return (
    <Panel className="h-full flex-1 overflow-hidden rounded-b-xl p-0">
      <CodeEditor
        value={activeTab?.code || ''}
        language={activeTab?.language || 'javascript'}
        theme={theme}
        fontSize={fontSize}
        onChange={updateTabCode}
      />
    </Panel>
  );
}
