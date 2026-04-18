import InputList from '../shared/InputList';

export default function InputPanel({ testCases, removeTestCase, updateTestCase, fontSize = 14 }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <InputList
        testCases={testCases}
        removeTestCase={removeTestCase}
        updateTestCase={updateTestCase}
        fontSize={fontSize}
      />
    </div>
  );
}
