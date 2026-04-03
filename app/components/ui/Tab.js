import { X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function Tab({ id, name, active, onClick, onClose }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? CSS.Translate.toString({ ...transform, y: 0 }) : undefined,
        zIndex: isDragging ? 50 : undefined,
      }}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`tab ${active ? 'tab-active' : 'tab-inactive'}`}
    >
      <span className="min-w-0 flex-1 truncate">{name}</span>
      {onClose && (
        <button
          className="tab-close"
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="h-3 w-3" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
