export const SaveModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-bg-elevated p-8 rounded-xl border border-border-primary">
        <h2 className="text-xl mb-4">Save Solutions</h2>
        <button onClick={onClose} className="px-4 py-2 bg-bg-hover rounded">Close</button>
      </div>
    </div>
  );
};
