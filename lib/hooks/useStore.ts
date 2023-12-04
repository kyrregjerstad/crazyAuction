import { useState, useEffect } from 'react';

// https://docs.pmnd.rs/zustand/integrations/persisting-store-data#hydration-and-asynchronous-storages
const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
): F | undefined => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default useStore;
