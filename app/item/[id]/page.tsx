import BidBox from '@/components/BidBox';
import ImageGallery from '@/components/ImageGallery';
import useGetSingleAuctionItem from '@/lib/hooks/useGetSingleAuctionItem';
import { getServerSession } from 'next-auth';

interface Props {
  params: { id: string };
}

const ItemDetailsPage = async ({ params }: Props) => {
  const session = await getServerSession();

  const auctionItem = await useGetSingleAuctionItem(params.id);

  if (!auctionItem) return null;

  const currentBid = auctionItem.bids.at(-1)?.amount || 0;

  return (
    <div className='mx-auto max-w-5xl p-8'>
      <div className='grid items-start gap-8 md:grid-cols-2'>
        <ImageGallery images={auctionItem.media} />

        <div className='space-y-6'>
          <h1 className='text-3xl font-bold'>{auctionItem.title}</h1>
          <div className='text-5xl font-bold text-white'>
            Current Bid: ${currentBid}
          </div>
          <BidBox listingId={params.id} currentBid={currentBid} />
          <p className='text-lg'>{auctionItem.description}</p>
          <div className='rounded-lg bg-zinc-800/50 p-6'>
            <h2 className='text-xl font-semibold'>Seller Information</h2>
            <div className='mt-4 flex items-center'>
              <svg
                className=' mr-2 h-8 w-8'
                fill='none'
                height='24'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                width='24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
                <circle cx='12' cy='7' r='4' />
              </svg>
              <span className='font-medium'>{auctionItem.seller.name}</span>
            </div>
            <div className='mt-2 flex items-center'>
              <svg
                className=' h-6 w-6 fill-accent'
                fill='none'
                height='24'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                width='24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <polyline points='20 6 9 17 4 12' />
              </svg>
              <span className='ml-2'>Verified Seller</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
