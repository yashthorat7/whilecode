import { X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Tab({ id, name, active, onClick, onClose }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: transform ? CSS.Translate.toString({ ...transform, y: 0 }) : undefined,
    zIndex: isDragging ? 50 : (active ? 20 : 0),
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick} 
      className={`tab ${active ? "tab-active" : "tab-inactive"} ${isDragging ? "z-50" : ""}`}
    >
      <span className="truncate flex-1 min-w-0">{name}</span>
      {onClose && (
        <button 
          className="tab-close" 
          onClick={(e) => { 
            e.stopPropagation(); 
            onClose(); 
          }}
        >
          <X className="w-3 h-3" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
