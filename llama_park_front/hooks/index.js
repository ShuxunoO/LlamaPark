import { useCallback, useEffect, useRef } from 'react';

export const useDebounceFn = (callback, timeout = 500, deps = []) => {
  const timer = useRef(null);

  const clearTimer = useCallback(() => {
    if (timer.current != null) {
      clearTimeout(timer.current);
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return useCallback((...args) => {
    clearTimer();
    timer.current = setTimeout(() => callback(...args), timeout);
  }, [callback, timeout, clearTimer].concat(deps));
};