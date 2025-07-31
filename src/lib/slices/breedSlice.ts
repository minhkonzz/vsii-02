import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { END_POINT } from "../../constants";
import type { Breed } from "./types";

interface BreedState {
  breeds: Breed[];
}

const initialState: BreedState = {
  breeds: [],
} as const;

export const fetchBreeds = createAsyncThunk<Breed[], AbortSignal>(
  "breeds/fetchBreeds",
  async (signal: AbortSignal, { rejectWithValue }) => {
    try {
      const response = await fetch(END_POINT, { signal });
      const { data } = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue("Failed to fetch breeds");
    }
  }
);

export const breedSlice = createSlice({
  name: "breeds",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreeds.fulfilled, (state, action) => {
        state.breeds = action.payload;
      });
  },
});

export const selectBreeds = (state: { breeds: BreedState }) => state.breeds;

export default breedSlice.reducer;
