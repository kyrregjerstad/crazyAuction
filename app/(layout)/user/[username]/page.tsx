import authOptions from '@/app/auth/authOptions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Listing } from '@/lib/schemas/listing';
import { getSingleUser } from '@/lib/services/getSingleUser';

import { getServerSession } from 'next-auth';
import Link from 'next/link';

interface Props {
  params: { username: string };
}

const ItemDetailsPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  const { username } = params;

  if (!session) return null;

  const user = await getSingleUser({
    username: username,
    jwt: session.user.accessToken,
  });

  if (!user) return null;

  const { avatar, name, credits, listings, wins } = user;

  // if (!auctionItem) return null;

  // const currentBid = auctionItem.bids.at(-1)?.amount || 0;

  return (
    <div className='grid max-w-5xl gap-6 md:grid-cols-3'>
      <div className='flex items-center gap-4'>
        <div className='rounded-lg shadow-md'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-32 w-32 border-2 border-accent'>
              <AvatarImage src={avatar || ''} />
              <AvatarFallback>CA</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div>
          <h2 className='text-2xl font-bold'>{name}</h2>
          <h3>${credits} Credits</h3>
          <h3>{user._count.listings} auctions</h3>
        </div>
      </div>

      <div className='rounded-lg  p-4 shadow-md md:col-span-3'>
        <h2 className='mb-2 text-lg font-bold'>Current Auctions</h2>
        <div className='grid gap-4'>
          {listings ? (
            listings.map((listing) => (
              <Listing key={listing.id} listing={listing} />
            ))
          ) : (
            <p>No auctions</p>
          )}
        </div>
      </div>
      <div className='rounded-lg  p-4 shadow-md md:col-span-3'>
        <h2 className='mb-2 text-lg font-bold'>Wins</h2>
        <div className='grid gap-4'></div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;

type ListingProps = {
  listing: Listing;
};

const Listing = ({ listing }: ListingProps) => {
  return (
    <>
      <Card>
        <CardHeader className='pb-4'>
          <Link href={`/item/${listing.id}`}>
            <CardTitle>{listing.title}</CardTitle>
          </Link>
        </CardHeader>
        <CardContent>
          <p className='text-sm'>{listing.description}</p>
        </CardContent>
      </Card>
    </>
  );
};
