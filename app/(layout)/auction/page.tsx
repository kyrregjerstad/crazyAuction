import { AuctionForm } from '@/components/new-auction-form';
import { AuctionFull } from '@/lib/schemas';
import { getSingleAuction } from '@/lib/services/auction-api/getSingleAuction';
import { getServerSession } from 'next-auth';

type Mode = 'create' | 'edit';

type SearchParams = {
  mode?: Mode;
  id?: string;
  step?: string;
};

type Props = {
  searchParams?: SearchParams;
};
export default async function NewAuctionPage({ searchParams }: Props) {
  const session = await getServerSession();

  // eslint-disable-next-line prefer-const
  let { mode = 'create', id, step = 'info' } = searchParams || {};

  if (mode && mode !== 'create' && mode !== 'edit') {
    mode = 'create';
  }

  let listing: AuctionFull | null = null;

  if (id && mode === 'edit' && step === 'info') {
    const requestedListing = await getSingleAuction(id);

    if (session?.user.name === requestedListing.seller.name) {
      listing = requestedListing;
    } else {
      mode = 'create';
    }
  }

  return (
    <>
      <div className='flex w-full max-w-6xl flex-col items-center justify-center p-4'>
        {mode === 'edit' ? (
          <h1 className='hidden pb-4 text-2xl font-bold sm:block sm:py-8 md:text-4xl lg:text-5xl'>
            Edit Auction
          </h1>
        ) : (
          <h1 className='hidden pb-4 text-2xl font-bold sm:block sm:py-8 md:text-4xl lg:text-5xl'>
            Create a New Auction
          </h1>
        )}

        <AuctionForm listing={listing} mode={mode} />
      </div>
    </>
  );
}
