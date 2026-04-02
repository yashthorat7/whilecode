import { Sparkles } from "lucide-react";
import Panel from "../ui/Panel";

export default function NotesPanel() {
  return (
    <Panel
      className="flex-1"
      actions={
        <button className="icon-btn">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      }
    >
      <div className="w-full h-full" />
    </Panel>
  );
}
