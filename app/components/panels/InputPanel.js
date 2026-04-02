import { Plus } from "lucide-react";
import Panel from "../ui/Panel";

export default function InputPanel() {
  return (
    <Panel
      className="flex-1"
      header="INPUT"
      actions={
        <button className="icon-btn">
          <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      }
    >
      <textarea className="textarea" />
    </Panel>
  );
}
