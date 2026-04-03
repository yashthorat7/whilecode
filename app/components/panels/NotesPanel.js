import { Sparkles } from "lucide-react";
import Panel from "../ui/Panel";
import { useTabs } from "../../hooks/useTabs";

export default function NotesPanel() {
  const { activeTab, updateTabNotes } = useTabs();

  return (
    <Panel
      className="flex-1"
      actions={
        <button className="icon-btn">
          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      }
    >
      <textarea
        className="w-full h-full bg-transparent outline-none resize-none text-[14px] font-mono text-gray-300 placeholder:text-gray-700 p-2 whitespace-pre-wrap"
        placeholder="notes here..."
        value={activeTab?.notes || ""}
        onChange={(e) => updateTabNotes(e.target.value)}
        spellCheck={false}
      />
    </Panel>
  );
}
