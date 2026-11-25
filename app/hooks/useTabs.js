'use client';

import { useState, useEffect } from 'react';
import { STORAGE_KEYS, DEFAULT_CODE_CPP } from '@/app/utils/constants';
import { arrayMove } from '@dnd-kit/sortable';

export function useTabs() {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0] || null;

  const getDynamicName = code => {
    if (!code || typeof code !== 'string') return null;
    const lineComment = code.match(/\/\/\s*(.*?)(\n|$)/);
    const blockComment = code.match(/\/\*\s*([\s\S]*?)\*\//);

    let commentText = '';
    if (lineComment && blockComment) {
      commentText = lineComment.index < blockComment.index ? lineComment[1] : blockComment[1];
    } else if (lineComment) {
      commentText = lineComment[1];
    } else if (blockComment) {
      commentText = blockComment[1];
    }

    const cleaned = commentText
      .trim()
      .replace(/^(?:leetcode\s*\d+[:\-]?|problem\s*\d+[:\-]?|#?\d+[\.:\-]?)\s*/i, '')
      .trim();

    const words = cleaned
      .split(/\s+/)
      .filter(w => w.length > 0)
      .slice(0, 4);
    return words.length > 0 ? words.join(' ') : null;
  };

  const getNextDefaultName = (currentTabs = []) => {
    let nextNum = 1;
    const names = new Set(currentTabs.map(t => t.name));
    while (names.has(`Solution ${nextNum}`)) {
      nextNum++;
    }
    return `Solution ${nextNum}`;
  };

  const createDefaultTab = (name = 'Solution 1') => ({
    id: crypto.randomUUID(),
    name,
    language: 'cpp',
    code: DEFAULT_CODE_CPP,
    notes: '',
    complexity: '',
    testCases: [
      { id: crypto.randomUUID(), input: '5', output: '120', expectedOutput: '120', status: 'idle' },
      { id: crypto.randomUUID(), input: '6', output: '720', expectedOutput: '720', status: 'idle' },
    ],
    createdAt: Date.now(),
  });

  const migrate = tab => ({
    ...tab,
    id: tab.id || crypto.randomUUID(),
    language: tab.language || 'cpp',
    notes: tab.notes ?? '',
    complexity: tab.complexity ?? '',
    testCases: (tab.testCases || []).map(tc => ({
      ...tc,
      id: tc.id || crypto.randomUUID(),
      expectedOutput:
        tc.expectedOutput ?? (tc.status === 'idle' || !tc.status ? tc.output || '' : ''),
      status: tc.status || 'idle',
    })),
  });

  useEffect(() => {
    const storedTabs = localStorage.getItem(STORAGE_KEYS.TABS);
    const storedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);

    let initialTabs = [];

    if (storedTabs) {
      initialTabs = JSON.parse(storedTabs).map(migrate);
    } else {
      initialTabs = [createDefaultTab()];
    }

    setTabs(initialTabs);

    if (storedActiveId && initialTabs.find(t => t.id === storedActiveId)) {
      setActiveTabId(storedActiveId);
    } else if (initialTabs.length > 0) {
      setActiveTabId(initialTabs[0].id);
    }
  }, []);

  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem(STORAGE_KEYS.TABS, JSON.stringify(tabs));
    }
  }, [tabs]);

  useEffect(() => {
    if (activeTabId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTabId);
    }
  }, [activeTabId]);

  const addTab = () => {
    if (tabs.length >= 12) return;
    const nextName = getNextDefaultName(tabs);
    const newTab = createDefaultTab(nextName);
    const nextTabs = [...tabs, newTab];
    setTabs(nextTabs);
    setActiveTabId(newTab.id);
  };

  const removeTab = id => {
    let nextTabs = tabs.filter(t => t.id !== id);

    if (nextTabs.length === 0) {
      const defaultTab = createDefaultTab();
      nextTabs = [defaultTab];
      setTabs(nextTabs);
      setActiveTabId(defaultTab.id);
      return;
    }

    setTabs(nextTabs);

    if (id === activeTabId) {
      const deletedIndex = tabs.findIndex(t => t.id === id);
      const nextActiveIndex = Math.min(deletedIndex, nextTabs.length - 1);
      setActiveTabId(nextTabs[nextActiveIndex].id);
    }
  };

  const updateActiveTab = partial => {
    setTabs(prev =>
      prev.map(t => {
        if (t.id !== activeTabId) return t;
        const updated = { ...t, ...partial };
        if (partial.code) {
          const dynamicName = getDynamicName(partial.code);
          if (dynamicName) updated.name = dynamicName;
        }
        return updated;
      })
    );
  };

  const updateTabCode = code => {
    setTabs(prev =>
      prev.map(t => {
        if (t.id !== activeTabId) return t;
        const dynamicName = getDynamicName(code);
        return { ...t, code, name: dynamicName || t.name };
      })
    );
  };

  const updateTabNotes = notes => updateActiveTab({ notes });
  const updateTabLanguage = language => updateActiveTab({ language });

  const addTestCase = () => {
    const newTestCase = {
      id: crypto.randomUUID(),
      input: '',
      output: '',
      expectedOutput: '',
      status: 'idle',
    };
    updateActiveTab({
      testCases: [...activeTab.testCases, newTestCase],
    });
  };

  const resetOutputs = () => {
    setTabs(prev =>
      prev.map(tab =>
        tab.id === activeTabId
          ? {
              ...tab,
              testCases: tab.testCases.map(tc => ({
                ...tc,
                output: tc.expectedOutput ?? '',
                status: 'idle',
              })),
            }
          : tab
      )
    );
  };

  const removeTestCase = id => {
    updateActiveTab({
      testCases: activeTab.testCases.filter(tc => tc.id !== id),
    });
  };

  const updateTestCase = (tcId, updates, tabId = activeTabId) => {
    setTabs(prev =>
      prev.map(tab => {
        if (tab.id !== tabId) return tab;
        return {
          ...tab,
          testCases: tab.testCases.map(tc => (tc.id === tcId ? { ...tc, ...updates } : tc)),
        };
      })
    );
  };

  const reorderTabs = (activeId, overId) => {
    if (activeId !== overId) {
      setTabs(items => {
        const oldIndex = items.findIndex(t => t.id === activeId);
        const newIndex = items.findIndex(t => t.id === overId);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    addTab,
    removeTab,
    reorderTabs,
    canAddTab: tabs.length < 12,
    updateActiveTab,
    updateTabCode,
    updateTabNotes,
    updateTabLanguage,
    addTestCase,
    removeTestCase,
    updateTestCase,
    resetOutputs,
  };
}
