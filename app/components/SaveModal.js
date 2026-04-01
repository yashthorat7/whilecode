export const SaveModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-bg-elevated border-border-primary rounded-xl border p-8">
        <h2 className="mb-4 text-xl">Save Solutions</h2>
        <button onClick={onClose} className="bg-bg-hover rounded px-4 py-2">
          Close
        </button>
      </div>
    </div>
  );
};
