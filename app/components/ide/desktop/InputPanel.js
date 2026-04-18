import { Plus } from 'lucide-react';
import Panel from '../../ui/Panel';
import InputList from '../shared/InputList';

export default function InputPanel({
  testCases,
  addTestCase,
  removeTestCase,
  updateTestCase,
  fontSize = 14,
}) {
  return (
    <Panel
      className="flex-1"
      header="INPUT"
      actions={
        <button className="icon-btn" onClick={addTestCase}>
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      }
    >
      <InputList
        testCases={testCases}
        removeTestCase={removeTestCase}
        updateTestCase={updateTestCase}
        fontSize={fontSize}
      />
    </Panel>
  );
}
