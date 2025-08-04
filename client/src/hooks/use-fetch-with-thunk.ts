import {
  useState,
  useCallback,
  useRef
} from "react";

import type { AsyncThunk } from "@reduxjs/toolkit";
import { NUM_OF_RETRIES } from "@/constants";
import { useAppDispatch, useAppSelector, type RootState } from "@/lib/redux/store";

interface UseFetchWithThunkReturn<S> {
  state: S;
  handleFetch: () => void;
  abort: () => void;
  retriesCount: number;
}

const useFetchWithThunk = <T, S>(
  thunkAction: AsyncThunk<T, FetchConfig, { rejectValue: any }>,
  selector: (state: RootState) => S,
  timeoutMs: number = 0,
  numOfRetries: number = NUM_OF_RETRIES
): UseFetchWithThunkReturn<S> => {
  const state = useAppSelector(selector);
  const dispatch = useAppDispatch();
  const abortControllerRef = useRef<AbortController>(null);
  const [retriesCount, setRetriesCount] = useState(0);

  const abort = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  };

  const handleFetch = useCallback(() => {
    abort();
    abortControllerRef.current = new AbortController();
    setRetriesCount(0);
    dispatch(thunkAction({ 
      signal: abortControllerRef.current!.signal, 
      timeoutMs,
      retry: {
        maxAttempts: numOfRetries,
        onRetry: (retryCount) => {
          setRetriesCount(retryCount);
        }
      }
    }));
  }, [
    abortControllerRef.current,
    numOfRetries,
    timeoutMs,
    thunkAction
  ]);

  return {
    state,
    handleFetch,
    abort,
    retriesCount
  };
};

export default useFetchWithThunk;
