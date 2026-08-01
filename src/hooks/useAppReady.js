import { useEffect, useState } from "react";

export function useAppReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsReady(true);
    }, 1400);

    return () => clearTimeout(timeoutId);
  }, []);

  return { isReady };
}
