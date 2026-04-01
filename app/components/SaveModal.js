'use client';

import { useState, useEffect } from 'react';
import JSZip from 'jszip';

const getFilename = (tab) => {
  const firstLine = (tab.code.split('\n')[0] || '').trim();
  const cleaned = firstLine
    .replace(/^\/\/\s*/, '')
    .replace(/^\/\*\s*/, '')
    .replace(/\*\/\s*$/, '')
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  const ext = tab.language === 'c' ? '.c' : '.cpp';
  return cleaned ? `${cleaned}${ext}` : `solution${ext}`;
};

export function SaveModal({ isOpen, onClose, tabs }) {
  const [mounted, setMounted] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setSelectedIds(tabs.map(t => t.id));
      const handleEscape = (e) => (e.key === 'Escape' && onClose());
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    } else {
      setMounted(false);
    }
  }, [isOpen, onClose, tabs]);

  const toggleSelect = (e, id) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const downloadFile = (tab) => {
    const filename = getFilename(tab);
    const blob = new Blob([tab.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSelected = async () => {
    const zip = new JSZip();
    const selectedTabs = tabs.filter(t => selectedIds.includes(t.id));
    selectedTabs.forEach(tab => zip.file(getFilename(tab), tab.code));
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whilecode_export_${new Date().getTime()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${mounted ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      
      <div 
        className={`
          relative w-full max-w-lg bg-bg-surface border border-border-primary rounded-xl overflow-hidden shadow-2xl flex flex-col transition-all duration-200
          ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        `}
      >
        <div className="p-4 border-b border-border-primary flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-text-primary">Export Solutions</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors text-[20px] leading-none">×</button>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2">
          {tabs.map((tab) => (
            <div 
              key={tab.id}
              onClick={() => downloadFile(tab)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-hover cursor-pointer group transition-colors"
            >
              <input 
                type="checkbox"
                checked={selectedIds.includes(tab.id)}
                onChange={(e) => toggleSelect(e, tab.id)}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 rounded border-border-primary bg-bg-elevated checked:bg-text-accent transition-all cursor-pointer"
              />
              <div className="flex flex-col gap-0.5 flex-1">
                <span className="text-[13px] font-medium text-text-primary group-hover:text-text-accent transition-colors">
                  {getFilename(tab)}
                </span>
                <span className="text-[11px] text-text-secondary">
                  Created: {new Date(tab.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold border ${tab.language === 'cpp' ? 'border-text-accent/20 text-text-accent bg-text-accent/5' : 'border-text-secondary/20 text-text-secondary bg-text-secondary/5'}`}>
                {tab.language === 'c' ? 'C' : 'C++'}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-bg-elevated/30 border-t border-border-primary flex flex-col gap-3">
          <button
            onClick={downloadSelected}
            disabled={selectedIds.length === 0}
            className="w-full py-2.5 bg-text-accent hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-[8px] text-[13px] font-semibold transition-all shadow-md active:scale-[0.98]"
          >
            Download {selectedIds.length} Selected as ZIP
          </button>
          <p className="text-[11px] text-text-secondary text-center">
            Click a row to download individual files instantly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SaveModal;
