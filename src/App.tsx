import { useRef } from "react";
import { Stack, Alert } from "@mui/material";
import { BreedItem } from "./components/breed-item";
import { fetchBreeds, selectBreeds } from "./lib/slices/breedSlice";
import { useFetchWithThunk } from "./hooks/use-fetch-with-thunk";
import { Spinner, Button } from "./components/shared";
import { reset } from "./lib/slices/breedSlice";
import { useAppDispatch } from "./lib/store";
import { NETWORK_ERR_STATUS } from "./constants";

import {
  Virtuoso as LargeListOptimizer,
  type VirtuosoHandle,
} from "react-virtuoso";

function App() {
  const largeListRef = useRef<VirtuosoHandle>(null);
  const dispatch = useAppDispatch();

  const {
    state: { breeds, nextPage, loading, error: fetchError },
    error,
    handleFetch,
    abort,
  } = useFetchWithThunk(fetchBreeds, selectBreeds);

  const refetchBreeds = () => {
    dispatch(reset());
    handleFetch();
  };

  const errorMsg = fetchError || error;
  const isEndOfList = !nextPage && breeds.length > 0;

  return (
    <>
      <Stack spacing={2} direction="row">
        <Button
          variant="contained"
          onClick={refetchBreeds}
          disabled={loading}
          sx={{ flex: 1 }}
        >
          Refetch Breeds
        </Button>
        <Button
          variant="outlined"
          onClick={abort}
          disabled={!loading}
          sx={{ flex: 1 }}
        >
          Abort
        </Button>
      </Stack>
      <LargeListOptimizer
        style={{ height: 700 }}
        ref={largeListRef}
        cellSpacing={2}
        data={breeds}
        endReached={fetchError ? undefined : () => {
          if (!nextPage) return;
          handleFetch();
        }}
        itemContent={(_, breed) => <BreedItem key={breed.id} breed={breed} />}
        components={{
          Footer: () => {
            if (errorMsg) {
              return (
                <Alert 
                  severity={errorMsg == NETWORK_ERR_STATUS && "error" || "info"}>
                  {errorMsg}
                </Alert>
              );
            }
            return isEndOfList || fetchError ? null : (
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
