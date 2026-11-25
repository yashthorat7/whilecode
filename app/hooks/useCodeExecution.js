'use client';

import { useState, useCallback } from 'react';
import { getFullCode } from '@/app/utils/codeTemplate';
import { DELIMITER } from '@/app/utils/constants';

export const useCodeExecution = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [globalError, setGlobalError] = useState(null);

  const run = useCallback(
    async (tab, updateTestCase) => {
      if (isRunning || !tab) return;

      setIsRunning(true);
      setGlobalError(null);
      setExecutionTime(null);

      const validCases = tab.testCases.filter(tc => tc.input?.trim());

      tab.testCases.forEach(tc => {
        const valid = tc.input?.trim();
        updateTestCase(
          tc.id,
          valid ? { status: 'running', output: '' } : { status: 'error', output: 'Empty input' },
          tab.id
        );
      });

      if (!validCases.length) {
        setIsRunning(false);
        return;
      }

      const combinedInput = validCases.map(tc => tc.input).join('\n') + '\n';
      const sourceCode = getFullCode(tab.code, tab.language);

      try {
        const response = await fetch('/api/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: sourceCode, input: combinedInput, language: tab.language }),
        });

        const data = await response.json();

        if (data.error) {
          setGlobalError(data.error.includes('Compilation Error') ? data.error : null);
          validCases.forEach(tc =>
            updateTestCase(tc.id, { status: 'error', output: data.error }, tab.id)
          );
        } else {
          const outputs = (data.output || '').split(DELIMITER).map(s => s.trim());
          validCases.forEach((tc, i) =>
            updateTestCase(tc.id, { status: 'success', output: outputs[i] || '' }, tab.id)
          );
          setExecutionTime(data.time);
        }
      } catch (err) {
        setGlobalError('Failed to execute code. Please check your connection or server.');
        validCases.forEach(tc =>
          updateTestCase(
            tc.id,
            { status: 'error', output: err.message || 'Execution failed' },
            tab.id
          )
        );
      } finally {
        setIsRunning(false);
      }
    },
    [isRunning]
  );

  const clearError = useCallback(() => {
    setGlobalError(null);
    setExecutionTime(null);
  }, []);

  return { isRunning, executionTime, globalError, run, clearError };
};
