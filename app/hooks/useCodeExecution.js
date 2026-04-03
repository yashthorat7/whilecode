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
      if (isRunning) return;

      setIsRunning(true);
      setGlobalError(null);
      setExecutionTime(null);

      tab.testCases.forEach(tc => {
        updateTestCase(tc.id, { status: 'running', output: '' });
      });

      try {
        const batchedStdin = tab.testCases.map(tc => tc.input).join('\n');
        const sourceCode = getFullCode(tab.code, tab.language);

        const response = await fetch('/api/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source_code: sourceCode,
            stdin: batchedStdin,
            language: tab.language,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          let errorMsg = data.message || 'Execution failed';
          if (data.signal === 'SIGKILL') errorMsg = 'Time Limit Exceeded (SIGKILL)';
          else if (data.signal === 'SIGSEGV') errorMsg = 'Segmentation Fault (SIGSEGV)';
          else if (data.signal === 'SIGFPE') errorMsg = 'Floating Point Exception (SIGFPE)';

          setGlobalError(errorMsg);
          tab.testCases.forEach(tc => {
            updateTestCase(tc.id, { status: 'error' });
          });
        } else {
          const outputs = data.stdout.split(DELIMITER).map(s => {
            const trimmed = s.trim();
            return trimmed.length > 10000
              ? trimmed.substring(0, 10000) + '\n[Output truncated...]'
              : trimmed;
          });

          tab.testCases.forEach((tc, i) => {
            updateTestCase(tc.id, {
              status: 'success',
              output: outputs[i] || '',
            });
          });
          setExecutionTime(data.time);
        }
      } catch (err) {
        setGlobalError('Network error occurred');
        tab.testCases.forEach(tc => {
          updateTestCase(tc.id, { status: 'error' });
        });
      } finally {
        setIsRunning(false);
      }
    },
    [isRunning]
  );

  return { isRunning, executionTime, globalError, run };
};
