import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { END_POINT, NETWORK_ERR_STATUS } from "@/constants";
import type { RootState } from "../store";
import type { Breed } from "@/types";

interface BreedState {
  breeds: Breed[];
  nextPage: number;
  loading: boolean;
  error: string;
}

const initialState: BreedState = {
  breeds: [],
  nextPage: 1,
  loading: true,
  error: ""
};

export const fetchBreeds = createAsyncThunk<Omit<BreedState, "error" | "loading">, AbortSignal>(
  "breeds/fetchBreeds",
  async (signal: AbortSignal, { rejectWithValue, getState }) => {
    try {
      const { breeds: { nextPage } } = getState() as RootState;
      const response = await fetch(END_POINT + `?page[number]=${nextPage}`, { signal });
      const { data: breeds, meta } = await response.json();
      return { breeds, nextPage: meta.pagination.next };
    } catch (error) {
      const errorMsg = (error as Error).message;
      return rejectWithValue(errorMsg.toLowerCase() == "failed to fetch" && NETWORK_ERR_STATUS || errorMsg);
    }
  }
);

export const breedSlice = createSlice({
  name: "breeds",
  initialState,
  reducers: {
    reset: (state) => {
      state.nextPage = 1;
      state.breeds = [];
      state.error = "";
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBreeds.pending, (state) => {
      state.error = "";
      state.loading = true;
    });
    builder.addCase(fetchBreeds.fulfilled, (state, action) => {
      state.breeds = [...state.breeds, ...action.payload.breeds];
      state.nextPage = action.payload.nextPage;
      state.loading = false;
    });
    builder.addCase(fetchBreeds.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },
});

export const { reset } = breedSlice.actions;
export const selectBreeds = (state: { breeds: BreedState }) => state.breeds;

export default breedSlice.reducer;
