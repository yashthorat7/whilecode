'use client';

import { useState, useCallback } from 'react';

export const useAiAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);

  const ask = useCallback(
    async (prompt, tab) => {
      if (!prompt.trim() || isLoading) return null;
      setIsLoading(true);
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: {
            code: tab.code,
            notes: tab.notes,
            language: tab.language,
            testCases: tab.testCases.map(tc => ({ input: tc.input, output: tc.output })),
          },
        }),
      });
      const data = response.ok ? await response.json() : null;
      setIsLoading(false);
      return data;
    },
    [isLoading]
  );

  return { isLoading, ask };
};
