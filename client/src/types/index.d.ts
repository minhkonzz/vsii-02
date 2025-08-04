interface Breed {
  id: string;
  type: string;
  attributes: {
    name: string;
    description: string;
    life: {
      min: number;
      max: number;
    };
    male_weight: {
      min: number;
      max: number;
    };
    female_weight: {
      min: number;
      max: number;
    };
  };
}

interface FetchConfig {
  timeoutMs?: number;
  signal?: AbortSignal;
  retry?: {
    maxAttempts?: number;
    onRetry?: (retryCount: number) => void;
    onMaxRetryTimesExceeded?: (error: AxiosError) => void;
  }
}

type ThunkReturn<T> = Omit<T, "error" | "loading" | "cacheTime">; 
