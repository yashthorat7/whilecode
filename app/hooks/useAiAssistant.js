'use client';

import { useState, useCallback } from 'react';

export const useAiAssistant = () => {
  const [loadingAction, setLoadingAction] = useState(null);

  const ask = useCallback(
    async (prompt, tab, action = 'search') => {
      if (loadingAction) return null;
      setLoadingAction(action);
      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            action,
            context: {
              code: tab?.code || '',
              notes: tab?.notes || '',
              language: tab?.language || 'cpp',
              testCases: (tab?.testCases || []).map(tc => ({
                input: tc.input,
                output: tc.output,
                status: tc.status,
              })),
            },
          }),
        });
        const data = response.ok ? await response.json() : null;
        return data;
      } finally {
        setLoadingAction(null);
      }
    },
    [loadingAction]
  );

  return { loadingAction, ask };
};
