import { useCallback, useEffect, useRef } from 'react';

const TEMPLATE_DATA_DEBOUNCE_MS = 500 as const;

type Callback<T extends unknown[]> = (...args: T) => void;

export const useDebouncedCallback = <T extends unknown[]>(
  callback: Callback<T>,
  delay: number = TEMPLATE_DATA_DEBOUNCE_MS
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFunction = useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunction;
};
