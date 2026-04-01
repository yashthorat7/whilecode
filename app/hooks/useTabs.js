import { useState, useCallback } from 'react';

export const useTabs = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);

  const addTab = useCallback(() => {}, []);
  const removeTab = useCallback(() => {}, []);
  const updateActiveTab = useCallback(() => {}, []);
  const addTestCase = useCallback(() => {}, []);
  const removeTestCase = useCallback(() => {}, []);
  const updateTestCase = useCallback(() => {}, []);

  return {
    tabs,
    activeTab: tabs.find((t) => t.id === activeTabId) || null,
    setActiveTabId,
    addTab,
    removeTab,
    updateActiveTab,
    addTestCase,
    removeTestCase,
    updateTestCase,
  };
};
