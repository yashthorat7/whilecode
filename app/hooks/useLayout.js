'use client';

import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/app/utils/constants';

export function useLayout(appRef, rightPanelRef, ioPanelRef) {
  const [editorWidth, setEditorWidth] = useState(55);
  const [ioHeight, setIoHeight] = useState(50);
  const [docsHeight, setDocsHeight] = useState(40);
  const [docsVisible, setDocsVisible] = useState(true);

  useEffect(() => {
    const storedWidth = localStorage.getItem(STORAGE_KEYS.EDITOR_WIDTH);
    const storedHeight = localStorage.getItem(STORAGE_KEYS.DOCS_HEIGHT);
    const storedVisible = localStorage.getItem(STORAGE_KEYS.DOCS_VISIBLE);

    if (storedWidth) setEditorWidth(parseFloat(storedWidth));
    if (storedHeight) setDocsHeight(parseFloat(storedHeight));
    if (storedVisible) setDocsVisible(JSON.parse(storedVisible));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EDITOR_WIDTH, editorWidth.toString());
  }, [editorWidth]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCS_HEIGHT, docsHeight.toString());
  }, [docsHeight]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCS_VISIBLE, JSON.stringify(docsVisible));
  }, [docsVisible]);

  const toggleDocs = useCallback(() => {
    setDocsVisible(prev => !prev);
  }, []);

  const createResizeHandler = (axis, currentValue, ref, min, max, setter) => e => {
    e.preventDefault();
    const isHorizontal = axis === 'x';
    const startPos = isHorizontal ? e.clientX : e.clientY;
    const startDim = currentValue;
    const rect = ref.current.getBoundingClientRect();
    const totalDim = isHorizontal ? rect.width : rect.height;

    const onMove = moveEvent => {
      const currentPos = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
      const delta = ((currentPos - startPos) / totalDim) * 100;
      setter(Math.min(max, Math.max(min, startDim + delta)));
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const startResizeH = useCallback(
    createResizeHandler('x', editorWidth, appRef, 25, 85, setEditorWidth),
    [editorWidth, appRef]
  );

  const startResizeV = useCallback(
    createResizeHandler('y', ioHeight, ioPanelRef, 20, 80, setIoHeight),
    [ioHeight, ioPanelRef]
  );

  const startResizeDocs = useCallback(
    createResizeHandler('y', docsHeight, rightPanelRef, 10, 70, setDocsHeight),
    [docsHeight, rightPanelRef]
  );

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
}
