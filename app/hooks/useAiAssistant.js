import { useState, useCallback } from 'react';

export const useAiAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {}, []);
  const ask = useCallback(async () => {}, []);

  return { isLoading, error, lastResponse, isOpen, toggleOpen, ask };
};
