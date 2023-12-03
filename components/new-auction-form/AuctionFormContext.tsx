import { ListingFull } from '@/lib/schemas/listing';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

type AuctionFormContextProps = {
  mode: 'create' | 'edit';
  listing?: ListingFull | null;
  allImagesUploaded: boolean;
  setAllImagesUploaded: (allImagesUploaded: boolean) => void;
};

const AuctionFormContext = createContext<AuctionFormContextProps | undefined>(
  undefined,
);

export const useAuctionFormContext = () => {
  const context = useContext(AuctionFormContext);

  if (!context) {
    throw new Error(
      'useAuctionFormContext must be used within an AuctionFormContextProvider',
    );
  }

  return context;
};

export const AuctionFormContextProvider = ({ children }: PropsWithChildren) => {
  const [mode] = useState<'create' | 'edit'>('create');
  const [listing, setListing] = useState<ListingFull | null>(null);
  const [allImagesUploaded, setAllImagesUploaded] = useState(true);

  return (
    <AuctionFormContext.Provider
      value={{
        mode,
        listing,
        allImagesUploaded,
        setAllImagesUploaded,
      }}
    >
      {children}
    </AuctionFormContext.Provider>
  );
};
