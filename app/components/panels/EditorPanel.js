import Panel from "../ui/Panel";

export default function EditorPanel() {
  return (
    <Panel className="relative z-10 -mt-px flex-1 rounded-tl-none flex justify-start items-end p-2">
      <button className="run-btn">Run</button>
    </Panel>
  );
}
