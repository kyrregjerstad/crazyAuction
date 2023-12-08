import { NewAuctionForm } from '@/components/new-auction-form';
import { ListingFull } from '@/lib/schemas/listing';
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
      <div className='flex w-full max-w-6xl flex-col items-center justify-center'>
        <h1 className='my-8 text-2xl font-bold md:text-4xl lg:text-5xl'>
          Create a New Auction
        </h1>

        <NewAuctionForm mode={mode} listing={listing} />
      </div>
    </>
  );
}
