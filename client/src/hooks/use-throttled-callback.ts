import { useEffect, useCallback, useRef } from "react";

/**
 * A type that represents a function that can be throttled.
 */
export type ThrottledCallback<T extends (...args: any[]) => any> = T;

/**
 * Options for the useThrottleCallback hook.
 */
interface ThrottleOptions {
  /**
   * The time window in milliseconds during which the function can be called at most once.
   * @default 1000 (1 second)
   */
  wait?: number;
  
  /**
   * Whether to execute the function immediately on the first call.
   * @default true
   */
  leading?: boolean;
  
  /**
   * Whether to execute the function on the trailing edge of the wait period.
   * @default true
   */
  trailing?: boolean;
}

/**
 * A hook that creates a throttled version of a callback function.
 * The function will be called at most once per specified wait period.
 * @param callback - The function to throttle
 * @param wait - The time window in milliseconds during which the function can be called at most once
 * @param options - Optional configuration options
 * @returns A throttled version of the callback function
 */

const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  wait: number = 1000,
  options: ThrottleOptions = {}
): ThrottledCallback<T> => {
  const { leading = true, trailing = false } = options;
  const timeoutRef = useRef<number | null>(null);
  const lastExecutionRef = useRef<number>(0);
  const argsRef = useRef<any[]>([]);
  const callbackRef = useRef(callback);

  // Update the callback reference when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
    // Cleanup any pending timeouts when the component unmounts
    return () => {
      clearTimeout(timeoutRef.current!);
    };
  }, [callback]);

  const throttled = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const remainingTime = lastExecutionRef.current + wait - now;

      if (remainingTime <= 0) {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Execute the callback immediately
        callbackRef.current(...args);
        lastExecutionRef.current = now;
        return;
      }

      // Store the arguments for a potential trailing call
      argsRef.current = args;

      // If trailing is false and we're not in leading mode, return early
      if (!trailing && !leading) return;

      // If there's no existing timeout and we're in leading mode, return early
      if (!timeoutRef.current && leading) return;

      // Set up a trailing call if needed
      if (!timeoutRef.current && trailing) {
        timeoutRef.current = setTimeout(() => {
          callbackRef.current(...argsRef.current);
          lastExecutionRef.current = Date.now();
          timeoutRef.current = null;
        }, remainingTime);
      }
    },
    [wait, leading, trailing]
  );

  return throttled as ThrottledCallback<T>;
};

export default useThrottledCallback;
