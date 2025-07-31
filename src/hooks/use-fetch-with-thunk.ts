import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DependencyList,
} from "react";

import type { AsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector, type RootState } from "../lib/store";

interface FetchThunkResult<S> {
  state: S;
  loading: boolean;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    handleFetch();
    return () => abort();
  }, dependencies);

  const abort = () => {
    abortSignalRef.current?.abort();
  };

  const handleFetch = useCallback(() => {
    try {
      abort();
      abortSignalRef.current = new AbortController();
      setError("");
      setLoading(true);
      dispatch(thunkAction(abortSignalRef.current.signal));
    } catch (error) {
      let errorMessage: string;
      if ((error as Error).name === "AbortError") {
        errorMessage = "Fetch Aborted";
      } else {
        console.error("Error fetching users:", error);
        errorMessage = (error as Error).message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [abortSignalRef.current]);

  return {
    state,
    loading,
    error,
    handleFetch,
    abort,
  };
};
