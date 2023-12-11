import authOptions from '@/app/(auth)/authOptions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Listing } from '@/lib/schemas/listingSchema';
import { getSingleUser } from '@/lib/services/getSingleUser';

import UserListingsGrid from '@/components/UserListingsGrid';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import AvatarWithEdit from './Avatar';
import UserWinsTable from './UserWinsTable';

type Props = {
  params: { username: string };
};

const UserPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  const { username } = params;

  if (!session) return null;

  const jwt = session.user.accessToken;

  const user = await getSingleUser({
    username: username,
    jwt,
  });

  if (!user) return null;

  const { avatar, name, credits, listings, wins } = user;

  const isLoggedInUser = session.user.name === username;

  return (
    <div className='grid w-full max-w-5xl gap-6 px-4 pt-6 md:grid-cols-3'>
      <div className='flex flex-col items-center gap-4 sm:flex-row'>
        <div className='rounded-lg shadow-md'>
          <div className='flex items-center gap-4'>
            <AvatarWithEdit canEdit={isLoggedInUser}>
              <Avatar className='relative h-32 w-32'>
                <AvatarImage src={avatar || ''} />
                <AvatarFallback>CA</AvatarFallback>
              </Avatar>
            </AvatarWithEdit>
          </div>
        </div>
        <div className='flex flex-col items-center sm:items-start'>
          <h2 className='text-2xl font-bold'>{name}</h2>
          <h3>${credits} Credits</h3>
          <h3>{user._count.listings} auctions</h3>
        </div>
      </div>

      <div className='rounded-lg shadow-md md:col-span-3'>
        <h2 className='pb-4 text-lg font-bold'>Active Auctions</h2>
        {listings ? (
          <UserListingsGrid username={username} />
        ) : (
          <p>No auctions</p>
        )}
      </div>
      <div className='rounded-lg py-4 shadow-md md:col-span-3'>
        <h2 className='mb-2 text-lg font-bold'>Wins</h2>
        <UserWinsTable username={username} winIds={wins} />
        <div className='grid gap-4'></div>
      </div>
    </div>
  );
};

export default UserPage;

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
