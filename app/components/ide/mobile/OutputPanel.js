import OutputList from '../shared/OutputList';

export default function OutputPanel({ testCases, globalError, fontSize = 14 }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <OutputList testCases={testCases} globalError={globalError} fontSize={fontSize} />
      <div className="h-20 shrink-0 opacity-0" />
    </div>
  );
}
