import Panel from "../ui/Panel";

export default function OutputPanel() {
  return (
    <Panel
      className="flex-1"
      header="OUTPUT"
      actions={<span className="text-[10px] text-gray-400 font-mono">O(n)</span>}
    >
      <div className="w-full h-full" />
    </Panel>
  );
}
