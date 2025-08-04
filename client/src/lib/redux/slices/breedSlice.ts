import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getAxiosInstance from "@/lib/axios";
import type { RootState } from "../store";
import { type AxiosError } from "axios";
import { ERR_TIMEOUT_MSG } from "@/constants";

interface BreedsState {
  breeds: Breed[];
  nextPage: number;
  loading: boolean;
  error: string;
  cacheTime: number; // Cache duration in milliseconds
  lastFetchedTime: number; // Timestamp of last successful fetch
}

const initialState: BreedsState = {
  breeds: [],
  nextPage: 1,
  loading: false,
  error: "",
  cacheTime: 80 * 1000, // about 1 minutes cache duration
  lastFetchedTime: 0,
};

export const fetchBreeds = createAsyncThunk<
  ThunkReturn<BreedsState>,
  FetchConfig
>(
  "breeds/fetchBreeds",
  async (fetchConfig: FetchConfig, { rejectWithValue, getState }) => {
    try {
      const axiosInstance = getAxiosInstance(fetchConfig);
      const { breeds: { nextPage } } = getState() as RootState;
      const response = await axiosInstance.get(`?page=${nextPage}`);
      const { data: breeds, meta } = response.data;
      return {
        breeds,
        nextPage: meta.pagination.next,
        lastFetchedTime: Date.now(),
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log("\n" + axiosError.message + ".", "Code:", axiosError.code);
      return rejectWithValue(
        (axiosError.code == "ECONNABORTED" && ERR_TIMEOUT_MSG) ||
        (axiosError?.response?.data as { message: string })?.message ||
         axiosError.message
      );
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
      state.lastFetchedTime = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBreeds.pending, (state) => {
      state.error = "";
      state.loading = true;
    });
    builder.addCase(fetchBreeds.fulfilled, (state, action) => {
      const { breeds, nextPage, lastFetchedTime } = action.payload;
      state.breeds = [...state.breeds, ...breeds];
      state.nextPage = nextPage;
      state.loading = false;
      state.lastFetchedTime = lastFetchedTime;
    });
    builder.addCase(fetchBreeds.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
  },
});

export const { reset } = breedSlice.actions;
export const selectBreeds = (state: { breeds: BreedsState }) => state.breeds;

export default breedSlice.reducer;
