import { create } from 'zustand';
import { AuctionFormComplete } from '../services/postListing';
import { persist, createJSONStorage } from 'zustand/middleware';

type Params = {
  storedData: AuctionFormComplete;
  updateStore: (partialData: Partial<AuctionFormComplete>) => void;
  getStore: () => AuctionFormComplete;
  clearStore: () => void;
};

const initialState = {} as AuctionFormComplete;

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

// const useAuctionFormStore = create<Params>((set, get) => ({
//   formData: initialState,
//   updateStore: (partialData) =>
//     set((state) => ({
//       formData: { ...state.formData, ...partialData },
//     })),
//   getStore: () => get().formData,
//   clearStore: () => set({ formData: initialState }),
// }));

export default useAuctionFormStore;
