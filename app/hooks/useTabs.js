'use client';

import { useState, useEffect } from 'react';
import { STORAGE_KEYS, DEFAULT_CODE_CPP } from '@/app/utils/constants';
import { arrayMove } from '@dnd-kit/sortable';

export function useTabs() {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0] || null;

  const renumber = tabs => tabs.map((tab, i) => ({ ...tab, name: `Solution ${i + 1}` }));

  const createDefaultTab = (name = 'Solution 1') => ({
    id: crypto.randomUUID(),
    name,
    language: 'cpp',
    code: DEFAULT_CODE_CPP,
    notes: '',
    testCases: [{ id: crypto.randomUUID(), input: '', output: '', status: 'idle' }],
    createdAt: Date.now(),
  });

  const migrate = tab => ({
    ...tab,
    id: tab.id || crypto.randomUUID(),
    language: tab.language || 'cpp',
    notes: tab.notes ?? '',
    testCases: (tab.testCases || []).map(tc => ({
      ...tc,
      id: tc.id || crypto.randomUUID(),
      status: tc.status || 'idle',
    })),
  });

  useEffect(() => {
    const storedTabs = localStorage.getItem(STORAGE_KEYS.TABS);
    const storedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);

    let initialTabs = [];

    if (storedTabs) {
      initialTabs = renumber(JSON.parse(storedTabs).map(migrate));
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
    const newTab = createDefaultTab(`Solution ${tabs.length + 1}`);
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

    const updatedTabs = renumber(nextTabs);
    setTabs(updatedTabs);

    if (id === activeTabId) {
      const deletedIndex = tabs.findIndex(t => t.id === id);
      const nextActiveIndex = Math.min(deletedIndex, updatedTabs.length - 1);
      setActiveTabId(updatedTabs[nextActiveIndex].id);
    }
  };

  const updateActiveTab = partial => {
    setTabs(prev => prev.map(t => (t.id === activeTabId ? { ...t, ...partial } : t)));
  };

  const updateTabCode = code => updateActiveTab({ code });
  const updateTabNotes = notes => updateActiveTab({ notes });
  const updateTabLanguage = language => updateActiveTab({ language });

  const addTestCase = () => {
    const newTestCase = {
      id: crypto.randomUUID(),
      input: '',
      output: '',
      status: 'idle',
    };
    updateActiveTab({
      testCases: [...activeTab.testCases, newTestCase],
    });
  };

  const removeTestCase = id => {
    updateActiveTab({
      testCases: activeTab.testCases.filter(tc => tc.id !== id),
    });
  };

  const updateTestCase = (id, partial) => {
    updateActiveTab({
      testCases: activeTab.testCases.map(tc => (tc.id === id ? { ...tc, ...partial } : tc)),
    });
  };

  const reorderTabs = (activeId, overId) => {
    if (activeId !== overId) {
      setTabs((items) => {
        const oldIndex = items.findIndex((t) => t.id === activeId);
        const newIndex = items.findIndex((t) => t.id === overId);
        return renumber(arrayMove(items, oldIndex, newIndex));
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
  };
}
