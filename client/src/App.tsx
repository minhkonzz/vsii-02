import { useState, useEffect, useRef } from "react";
import { Stack } from "@mui/material";
import { AlertWithAction } from "./components/shared/alert-with-action";
import { Spinner, MuiButton } from "./components/shared";
import { useAppDispatch } from "./lib/redux/store";
import { TIMEOUT_MS } from "./constants";
import BreedItem from "./components/breed-item";

import {
  fetchBreeds,
  selectBreeds,
  reset,
} from "./lib/redux/slices/breedSlice";

import {
  useFetchWithThunk,
  useNetworkDetector,
  useThrottledCallback,
} from "./hooks";

import {
  Virtuoso as LargeListOptimizer,
  type VirtuosoHandle,
} from "react-virtuoso";

function App() {
  const [clickedAbort, setClickedAbort] = useState(false);
  const largeListRef = useRef<VirtuosoHandle>(null);
  const dispatch = useAppDispatch();

  const {
    state: {
      breeds,
      nextPage,
      loading,
      error,
      lastFetchedTime,
      cacheTime,
    },
    handleFetch,
    abort,
    retriesCount,
  } = useFetchWithThunk(fetchBreeds, selectBreeds, TIMEOUT_MS);

  useEffect(() => {
    if (Date.now() - lastFetchedTime > cacheTime) {
      // console.log("Fetch data");
      handleFetch();
    }
    return () => abort();
  }, []);

  const onFetch = () => {
    setClickedAbort(false);
    handleFetch();
  };

  const onAbort = () => {
    setClickedAbort(true);
    abort();
  }

  const refetchBreeds = () => {
    dispatch(reset());
    onFetch();
  };

  const onFetchThrottled = useThrottledCallback(onFetch, 1000);

  const isOnline = useNetworkDetector({
    onOnline: onFetchThrottled,
  });

  const errorMsg = (clickedAbort && "Aborted request") || error;
  const isEndOfList = !nextPage && breeds.length > 0;

  return (
    <>
      <Stack spacing={2} direction="row">
        <MuiButton
          variant="contained"
          onClick={refetchBreeds}
          disabled={loading || !isOnline}
          sx={{ flex: 1 }}
        >
          {(loading && "Fetching") || "Refetch"} Breeds
        </MuiButton>
        <MuiButton
          variant="outlined"
          onClick={onAbort}
          disabled={!loading}
          sx={{ flex: 1 }}
        >
          Abort
        </MuiButton>
      </Stack>
      <LargeListOptimizer
        style={{ height: 700 }}
        ref={largeListRef}
        cellSpacing={2}
        data={breeds}
        endReached={errorMsg || !nextPage ? undefined : handleFetch}
        itemContent={(_, breed) => <BreedItem key={breed.id} breed={breed} />}
        components={{
          Footer: () => {
            if (errorMsg) {
              const severity = (clickedAbort && "info") || "error";
              return (
                <AlertWithAction
                  severity={severity}
                  message={errorMsg}
                  onAction={onFetch}
                  actionTexts={{
                    info: "Continue to fetch",
                    error: "Retry",
                  }}
                />
              );
            }
            if (retriesCount > 0) {
              return (
                <Spinner
                  text={
                    ((breeds.length == 0 && "Loading breeds") ||
                      "Loading more breeds") +
                    ", " +
                    "but may take longer than expected"
                  }
                />
              );
            }
            return isEndOfList ? null : (
              <Spinner
                text={
                  (breeds.length == 0 && "Loading breeds") ||
                  "Loading more breeds"
                }
              />
            );
          },
        }}
      />
    </>
  );
}

export default App;
