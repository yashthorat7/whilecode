import { X } from "lucide-react";

export default function Tab({ name, active, onClick, onClose }) {
  return (
    <div onClick={onClick} className={`tab ${active ? "tab-active" : "tab-inactive"}`}>
      <span className="truncate">{name}</span>
      {onClose && (
        <button className="tab-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          <X className="w-3 h-3" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
