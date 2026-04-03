import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import Panel from '../ui/Panel';
import { Download, Copy, Check, ListChecks } from 'lucide-react';

export default function SaveModal({ tabs, activeTabId, onClose }) {
  const [selectedIds, setSelectedIds] = useState([activeTabId]);
  const [downloading, setDownloading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!selectedIds.includes(activeTabId)) setSelectedIds(p => [...p, activeTabId]);
  }, [activeTabId]);

  const toggleTab = id =>
    setSelectedIds(p => (p.includes(id) ? p.filter(i => i !== id) : [...p, id]));

  const getFilename = tab => {
    const firstLine = (tab.code.split('\n')[0] || '').trim();
    const cleaned = firstLine
      .replace(/^\/\/\s*/, '')
      .replace(/^\/\*\s*/, '')
      .replace(/\*\/\s*$/, '')
      .replace(/[^a-zA-Z0-9\s\-_]/g, '')
      .trim()
      .replace(/\s+/g, '_');
    return cleaned ? `${cleaned}.${tab.language || 'cpp'}` : `solution.${tab.language || 'cpp'}`;
  };

  const handleDownload = async () => {
    if (selectedIds.length === 0) return;
    setDownloading(true);
    try {
      if (selectedIds.length === 1) {
        const tab = tabs.find(t => t.id === selectedIds[0]);
        if (!tab) return;
        const url = URL.createObjectURL(new Blob([tab.code], { type: 'text/plain' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = getFilename(tab);
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const zip = new JSZip();
        selectedIds.forEach(id => {
          const tab = tabs.find(t => t.id === id);
          if (tab) zip.file(getFilename(tab), tab.code);
        });
        const url = URL.createObjectURL(await zip.generateAsync({ type: 'blob' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `whilecode_export_${Date.now()}.zip`;
        a.click();
        URL.revokeObjectURL(url);
      }
      onClose();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Panel
      className="h-full w-full"
      header="EXPORT"
      actions={
        <>
          <button
            onClick={() =>
              setSelectedIds(selectedIds.length === tabs.length ? [] : tabs.map(t => t.id))
            }
            className="icon-btn"
          >
            <ListChecks className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <button
            onClick={handleDownload}
            disabled={selectedIds.length === 0 || downloading}
            className="icon-btn disabled:opacity-50"
          >
            {downloading ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-600 border-t-gray-300" />
            ) : (
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
            )}
          </button>
        </>
      }
    >
      <div className="h-full divide-y divide-gray-700 overflow-y-auto select-none">
        {tabs.map(tab => {
          const isSelected = selectedIds.includes(tab.id);
          return (
            <div
              key={tab.id}
              onClick={() => toggleTab(tab.id)}
              className="group flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${isSelected ? 'border-gray-300 bg-gray-300 text-gray-900' : 'border-gray-600 bg-transparent'}`}
                >
                  {isSelected && <Check className="h-2.5 w-2.5" strokeWidth={4} />}
                </div>
                <span
                  className={`truncate font-mono text-xs ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}
                >
                  {tab.name}
                </span>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(tab.code);
                  setCopiedId(tab.id);
                  setTimeout(() => setCopiedId(null), 2000);
                }}
                className="p-1 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-gray-300"
              >
                {copiedId === tab.id ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
