import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSingleUser } from '@/lib/services/getSingleUser';
import { getServerSession } from 'next-auth';

interface Props {
  params: { username: string };
}

const ItemDetailsPage = async ({ params }: Props) => {
  const session = await getServerSession();

  if (!session) return null;

  console.log(session);

  const user = await getSingleUser({
    username: session.user.name,
    jwt: session.user.accessToken,
  });

  if (!user) return null;

  // if (!auctionItem) return null;

  // const currentBid = auctionItem.bids.at(-1)?.amount || 0;

  return (
    <div className='grid gap-6 md:grid-cols-3'>
      <div className='rounded-lg p-4 shadow-md'>
        <div className='flex items-center gap-4'>
          <img
            alt='Profile Picture'
            className='rounded-full'
            height='64'
            src='/placeholder.svg'
            style={{
              aspectRatio: '64/64',
              objectFit: 'cover',
            }}
            width='64'
          />
          <div>
            <h2 className='text-lg font-bold'>{user.name}</h2>
            <p className='text-sm'>Los Angeles, CA</p>
            <p className='text-sm'>Member since 2020</p>
          </div>
        </div>
      </div>
      <div className='rounded-lg p-4 shadow-md md:col-span-2'>
        <h2 className='mb-2 text-lg font-bold'>Bidding Activity</h2>
        <p className='text-sm'>Total Bids: 20</p>
        <p className='text-sm'>Won Bids: 5</p>
        <p className='text-sm'>Lost Bids: 15</p>
      </div>
      <div className='rounded-lg  p-4 shadow-md md:col-span-3'>
        <h2 className='mb-2 text-lg font-bold'>Current Auctions</h2>
        <div className='grid gap-4'>
          <Card>
            <CardHeader className='pb-4'>
              <CardTitle>Item 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm'>Current Bid: $100</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-4'>
              <CardTitle>Item 2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm'>Current Bid: $200</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className='rounded-lg  p-4 shadow-md md:col-span-3'>
        <h2 className='mb-2 text-lg font-bold'>Past Auctions</h2>
        <div className='grid gap-4'>
          <Card>
            <CardHeader className='pb-4'>
              <CardTitle>Item 3</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm'>Winning Bid: $150</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-4'>
              <CardTitle>Item 4</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm'>Winning Bid: $250</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
