import { NewAuctionForm } from '@/components/new-auction-form';
import { ListingFull } from '@/lib/schemas/listingSchema';
import { getSingleListing } from '@/lib/services/getSingleListing';
import { getServerSession } from 'next-auth';

type Mode = 'create' | 'edit';

type SearchParams = {
  mode?: Mode;
  id?: string;
};

type Props = {
  searchParams?: SearchParams;
};
export default async function NewAuctionPage({ searchParams }: Props) {
  const session = await getServerSession();

  let { mode, id } = searchParams || {
    mode: 'create',
    id: null,
  };

  if (!mode) {
    mode = 'create';
  }

  if (mode && mode !== 'create' && mode !== 'edit') {
    mode = 'create';
  }

  let listing: ListingFull | null = null;

  if (id && mode === 'edit') {
    const requestedListing = await getSingleListing(id);

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
          <h1 className='pb-4 text-2xl font-bold sm:py-8 md:text-4xl lg:text-5xl'>
            Edit Auction
          </h1>
        ) : (
          <h1 className='pb-4 text-2xl font-bold sm:py-8 md:text-4xl lg:text-5xl'>
            Create a New Auction
          </h1>
        )}

        <NewAuctionForm mode={mode} listing={listing} />
      </div>
    </>
  );
}
