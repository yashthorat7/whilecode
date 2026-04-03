'use client';

import { useState, useCallback } from 'react';

export const useAiAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
    setError(null);
  }, []);

  const ask = useCallback(
    async (prompt, tab) => {
      if (!prompt.trim() || isLoading) return null;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            context: {
              code: tab.code,
              notes: tab.notes,
              language: tab.language,
              testCases: tab.testCases.map(tc => ({
                input: tc.input,
                output: tc.output,
              })),
            },
          }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('AI rate limit reached. Please wait a moment.');
          }
          throw new Error('AI service unavailable. Please try again later.');
        }

        const data = await response.json();
        setLastResponse(data);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to get AI response';
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  return {
    isLoading,
    error,
    isOpen,
    toggleOpen,
    ask,
    lastResponse,
  };
};
