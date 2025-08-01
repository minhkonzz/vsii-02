import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DependencyList,
} from "react";

import type { AsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector, type RootState } from "@/lib/store";

interface FetchThunkResult<S> {
  state: S;
  error: string;
  handleFetch: () => void;
  abort: () => void;
}

export const useFetchWithThunk = <T, S>(
  thunkAction: AsyncThunk<T, AbortSignal, { rejectValue: any }>,
  selector: (state: RootState) => S,
  dependencies: DependencyList = []
): FetchThunkResult<S> => {
  const state = useAppSelector(selector);
  const dispatch = useAppDispatch();
  const abortSignalRef = useRef<AbortController>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    handleFetch();
    return () => abort();
  }, dependencies);

  const abort = () => {
    abortSignalRef.current?.abort();
  };

  const handleFetch = useCallback(async () => {
    try {
      abort();
      abortSignalRef.current = new AbortController();
      setError("");
      dispatch(thunkAction(abortSignalRef.current.signal));
    } catch (error) {
      console.error("Error fetching users:", error);
      setError((error as Error).message);
    }
  }, [abortSignalRef.current]);

  return {
    state,
    error,
    handleFetch,
    abort
  };
};
