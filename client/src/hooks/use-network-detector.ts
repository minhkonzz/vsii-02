import { useState, useEffect } from "react";

type Params = {
  onOnline?: () => void;
  onOffline?: () => void;
};

export default function useNetworkDetector(params?: Params) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      params?.onOnline?.();
      setIsOnline(true);
    }
    const handleOffline = () => {
      params?.onOffline?.();
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}