import Panel from '../ui/Panel';

export default function EditorPanel() {
  return (
    <Panel className="relative z-10 -mt-px flex flex-1 items-end justify-start rounded-tl-none p-2">
      <button className="run-btn">Run</button>
    </Panel>
  );
}
