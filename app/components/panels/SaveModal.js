import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import Panel from '../ui/Panel';
import { Download, Copy, Check, ListChecks } from 'lucide-react';

const getFilename = tab => {
  const cleaned = (tab.code.split('\n')[0] || '')
    .trim()
    .replace(/^\/\/\s*/, '')
    .replace(/^\/\*\s*/, '')
    .replace(/\*\/\s*$/, '')
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  return cleaned ? `${cleaned}.${tab.language || 'cpp'}` : `solution.${tab.language || 'cpp'}`;
};

const triggerDownload = (url, filename) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export default function SaveModal({ tabs, activeTabId, onClose }) {
  const [selectedIds, setSelectedIds] = useState([activeTabId]);
  const [downloading, setDownloading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!selectedIds.includes(activeTabId)) setSelectedIds(p => [...p, activeTabId]);
  }, [activeTabId]);

  const toggleTab = id =>
    setSelectedIds(p => (p.includes(id) ? p.filter(i => i !== id) : [...p, id]));
  const toggleAll = () =>
    setSelectedIds(selectedIds.length === tabs.length ? [] : tabs.map(t => t.id));

  const handleDownload = async () => {
    if (!selectedIds.length) return;
    setDownloading(true);
    if (selectedIds.length === 1) {
      const tab = tabs.find(t => t.id === selectedIds[0]);
      if (tab)
        triggerDownload(
          URL.createObjectURL(new Blob([tab.code], { type: 'text/plain' })),
          getFilename(tab)
        );
    } else {
      const zip = new JSZip();
      selectedIds.forEach(id => {
        const tab = tabs.find(t => t.id === id);
        if (tab) zip.file(getFilename(tab), tab.code);
      });
      triggerDownload(
        URL.createObjectURL(await zip.generateAsync({ type: 'blob' })),
        `whilecode_export_${Date.now()}.zip`
      );
    }
    setDownloading(false);
    onClose();
  };

  return (
    <Panel
      className="h-full w-full"
      header="EXPORT"
      actions={
        <>
          <button onClick={toggleAll} className="icon-btn">
            <ListChecks className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <button
            onClick={handleDownload}
            disabled={!selectedIds.length || downloading}
            className="icon-btn disabled:opacity-40"
          >
            {downloading ? (
              <div className="spinner" />
            ) : (
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
            )}
          </button>
        </>
      }
    >
      <div className="panel-list">
        {tabs.map(tab => {
          const isSelected = selectedIds.includes(tab.id);
          return (
            <div key={tab.id} className="export-row group" onClick={() => toggleTab(tab.id)}>
              <div className="flex items-center gap-3">
                <div className={`export-check${isSelected ? ' selected' : ''}`}>
                  {isSelected && <Check className="h-2.5 w-2.5" strokeWidth={4} />}
                </div>
                <span className={`export-name${isSelected ? ' selected' : ''}`}>{tab.name}</span>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(tab.code);
                  setCopiedId(tab.id);
                  setTimeout(() => setCopiedId(null), 2000);
                }}
                className="icon-btn opacity-0 group-hover:opacity-100"
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
