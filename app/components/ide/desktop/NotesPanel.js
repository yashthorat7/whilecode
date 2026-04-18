import Panel from '../../ui/Panel';
import AiDrawer from '../../ui/AiDrawer';

export default function NotesPanel({
  notes,
  updateNotes,
  onAiAction,
  loadingAction,
  fontSize = 14,
}) {
  return (
    <Panel className="flex-1">
      <div className="group relative flex h-full w-full flex-col">
        <textarea
          style={{ fontSize }}
          className="notes-textarea"
          placeholder="Notes..."
          value={notes || ''}
          onChange={e => updateNotes(e.target.value)}
          spellCheck={false}
        />
        <AiDrawer
          className="absolute right-2 bottom-2 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          onAiAction={onAiAction}
          loadingAction={loadingAction}
        />
      </div>
    </Panel>
  );
}
