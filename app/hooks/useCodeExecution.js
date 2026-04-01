import { useState, useCallback } from 'react';

export const useCodeExecution = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [globalError, setGlobalError] = useState(null);

  const run = useCallback(() => {}, []);

  return { isRunning, executionTime, globalError, run };
};
