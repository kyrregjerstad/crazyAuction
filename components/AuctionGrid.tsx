import { PropsWithChildren } from 'react';

const AuctionGrid = ({ children }: PropsWithChildren) => {
  return (
    <div className='grid grid-cols-1 gap-x-4 gap-y-6 pt-8 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-8 xl:grid-cols-5'>
      {children}
    </div>
  );
};

export default AuctionGrid;
