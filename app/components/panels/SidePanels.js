import NotesPanel from "./NotesPanel";
import InputPanel from "./InputPanel";
import OutputPanel from "./OutputPanel";
import ResizeHandle from "../ui/ResizeHandle";

export default function SidePanels() {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="md:hidden h-full">
        <NotesPanel />
      </div>
      <div className="hidden md:flex md:flex-col h-full">
        <NotesPanel />
        <ResizeHandle orientation="horizontal" />
        <InputPanel />
        <ResizeHandle orientation="horizontal" />
        <OutputPanel />
      </div>
    </div>
  );
}
