import { PropsWithChildren } from 'react';

const AuctionGrid = ({ children }: PropsWithChildren) => {
  return (
    <div className='grid-cols-auctions gap grid gap-x-4 gap-y-6 pt-8 lg:gap-x-6 lg:gap-y-8'>
      {children}
    </div>
  );
};

export default AuctionGrid;
