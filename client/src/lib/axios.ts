import axios, { type AxiosError, type AxiosInstance } from "axios";
import { END_POINT } from "../constants";
import axiosRetry from "axios-retry";

const getAxiosInstance = (axiosConfig: FetchConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: END_POINT,
    ...(axiosConfig.signal && {
      signal: axiosConfig.signal,
    }),
    ...(axiosConfig.timeoutMs && {
      timeout: axiosConfig.timeoutMs,
    }),
  });

  if (axiosConfig.retry) {
    axiosRetry(instance, {
      retries: axiosConfig.retry.maxAttempts,
      retryDelay: (retryCount) => retryCount * 2000,
      shouldResetTimeout: true,
      retryCondition: (error: AxiosError) => {
        const isServerError = !!error.response; // Lỗi server (có response, ví dụ 500, 429)
        return isServerError;
      },
      onRetry: (retryCount: number, error: AxiosError) => {
        console.log("\n" + error.message + ".", "Code:", error.code);
        console.log("Retry request time:", retryCount);
        axiosConfig.retry?.onRetry?.(retryCount);
      },
      onMaxRetryTimesExceeded: (error: AxiosError) => {
        axiosConfig.retry?.onMaxRetryTimesExceeded?.(error);
      },
    });
  }
  return instance;
};

export default getAxiosInstance;
