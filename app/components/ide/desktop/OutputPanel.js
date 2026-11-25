import Panel from '../../ui/Panel';
import OutputList from '../shared/OutputList';

export default function OutputPanel({
  testCases,
  globalError,
  complexity,
  fontSize = 14,
  onResetOutput,
}) {
  return (
    <Panel
      className="flex-1"
      header={
        <button type="button" onClick={onResetOutput} className="uppercase outline-none">
          OUTPUT
        </button>
      }
      actions={<span className="header-badge">{complexity || '-- --'}</span>}
    >
      <OutputList testCases={testCases} globalError={globalError} fontSize={fontSize} />
    </Panel>
  );
}
