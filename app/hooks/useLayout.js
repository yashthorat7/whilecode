import { useState, useCallback } from 'react';

export const useLayout = (appRef, rightPanelRef, ioPanelRef) => {
  const [editorWidth, setEditorWidth] = useState(55);
  const [ioHeight, setIoHeight] = useState(50);
  const [docsHeight, setDocsHeight] = useState(40);
  const [docsVisible, setDocsVisible] = useState(true);

  const toggleDocs = useCallback(() => {}, []);
  const startResizeH = useCallback(() => {}, []);
  const startResizeV = useCallback(() => {}, []);
  const startResizeDocs = useCallback(() => {}, []);

  return {
    editorWidth,
    ioHeight,
    docsHeight,
    docsVisible,
    toggleDocs,
    startResizeH,
    startResizeV,
    startResizeDocs,
  };
};
