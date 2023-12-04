import { useState, useEffect } from 'react';
import useAuctionFormStore from './useAuctionFormStore';

const useHydratedStore = () => {
  // Use the Zustand store to get the current state
  const storeState = useAuctionFormStore((state) => state);

  // Manage the local state that will be kept in sync with the Zustand store
  const [data, setData] = useState(storeState);

  useEffect(() => {
    // Update the local state whenever the Zustand store changes
    setData(storeState);
  }, [storeState]);

  return data;
};

export default useHydratedStore;
