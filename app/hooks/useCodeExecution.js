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

      const validTestCases = tab.testCases.filter(tc => tc.input && tc.input.trim());
      const invalidTestCaseIds = tab.testCases
        .filter(tc => !tc.input || !tc.input.trim())
        .map(tc => tc.id);

      tab.testCases.forEach(tc => {
        if (invalidTestCaseIds.includes(tc.id)) {
          updateTestCase(tc.id, { status: 'error', output: 'Invalid test case' }, tab.id);
        } else {
          updateTestCase(tc.id, { status: 'running', output: '' }, tab.id);
        }
      });

      if (validTestCases.length === 0) {
        setIsRunning(false);
        return;
      }

      try {
        const combinedInput = validTestCases.map(tc => tc.input).join('\n') + '\n';
        const sourceCode = getFullCode(tab.code, tab.language);

        const response = await fetch('/api/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: sourceCode,
            input: combinedInput,
            language: tab.language,
          }),
        });

        const data = await response.json();
        console.log('Execution Data:', data);

        if (data.error) {
          setGlobalError(data.error.includes('Compilation Error') ? data.error : null);
          validTestCases.forEach(tc => {
            updateTestCase(tc.id, { status: 'error', output: data.error }, tab.id);
          });
        } else {
          const outputs = (data.output || '').split(DELIMITER).map(s => s.trim());
          validTestCases.forEach((tc, i) => {
            updateTestCase(tc.id, {
              status: 'success',
              output: outputs[i] || '',
            }, tab.id);
          });
          setExecutionTime(data.time);
        }
      } catch (err) {
        console.error('Network error:', err);
        setGlobalError('Network error occurred');
        validTestCases.forEach(tc => {
          updateTestCase(tc.id, { status: 'error', output: 'Network Error' }, tab.id);
        });
      } finally {
        setIsRunning(false);
      }
    },
    [isRunning]
  );

  return { isRunning, executionTime, globalError, run };
};
