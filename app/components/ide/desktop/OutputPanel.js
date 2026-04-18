import Panel from '../../ui/Panel';
import OutputList from '../shared/OutputList';

export default function OutputPanel({ testCases, globalError, complexity, fontSize = 14 }) {
  return (
    <Panel
      className="flex-1"
      header="OUTPUT"
      actions={<span className="header-badge">{complexity || '-- --'}</span>}
    >
      <OutputList testCases={testCases} globalError={globalError} fontSize={fontSize} />
    </Panel>
  );
}
