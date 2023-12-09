import { create } from 'zustand';
import { AuctionFormComplete } from '@/lib/schemas/auctionSchema';

import { persist, createJSONStorage } from 'zustand/middleware';

type StoredData = AuctionFormComplete & { id?: string };

type Params = {
  storedData: StoredData;
  updateStore: (partialData: Partial<StoredData>) => void;
  getStore: () => StoredData;
  clearStore: () => void;
};

const initialState = {} as StoredData;

const useAuctionFormStore = create<Params>()(
  persist(
    (set, get) => ({
      storedData: initialState,
      updateStore: (partialData) =>
        set((state) => ({
          storedData: { ...state.storedData, ...partialData },
        })),
      getStore: () => get().storedData,
      clearStore: () => set({ storedData: initialState }),
    }),
    {
      name: 'auctionForm',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useAuctionFormStore;
