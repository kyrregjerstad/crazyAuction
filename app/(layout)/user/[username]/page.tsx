import authOptions from '@/app/(auth)/authOptions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getSingleUser } from '@/lib/services/auction-api';

import UserListingsGrid from '@/components/UserListingsGrid';
import { getServerSession } from 'next-auth';
import AvatarWithEdit from './Avatar';
import UserWinsTable from './UserWinsTable';
import UserAllAuctionsTable from './UserAllAuctionsTable';

type Props = {
  params: { username: string };
};

const UserPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  const { username } = params;

  if (!session) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p>You must be logged in to see this page</p>
      </div>
    );
  }

  const jwt = session.user.accessToken;

  const user = await getSingleUser({
    username: username,
    jwt,
  });

  if (!user) return null;

  const { avatar, name, credits, listings, wins } = user;

  const allAuctionIds = listings?.map((listing) => listing.id);

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
        <h2 className='mb-2 text-lg font-bold'>All auctions</h2>
        <UserAllAuctionsTable
          username={username}
          allAuctionIds={allAuctionIds}
        />
        <div className='grid gap-4'></div>
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
