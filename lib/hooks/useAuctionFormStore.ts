import { create } from 'zustand';
import { AuctionFormComplete } from '../services/postListing';

type Params = {
  formData: AuctionFormComplete;
  setStore: (partialData: Partial<AuctionFormComplete>) => void;
  getStore: () => AuctionFormComplete;
  clearStore: () => void;
};

const initialState = {} as AuctionFormComplete;

const useAuctionFormStore = create<Params>((set, get) => ({
  formData: initialState,
  setStore: (partialData) =>
    set((state) => ({
      formData: { ...state.formData, ...partialData },
    })),
  getStore: () => get().formData,
  clearStore: () => set({ formData: initialState }),
}));

export default useAuctionFormStore;
