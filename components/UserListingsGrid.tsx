'use client';

import fallbackImg from '@/public/fallback-image.webp';
import { useRouter } from 'next/navigation';

import Skeleton from './Skeleton';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import useQuerySingleUser from '@/lib/hooks/useQuerySingleUser';
import Link from 'next/link';
import AnimatedButton from './AnimatedButton';
import EndingTime from './EndingTime';
import Image from './Image';

type Props = {
  username: string;
};

const UserListingsGrid = ({ username }: Props) => {
  const router = useRouter();
  const skeletonArr = Array.from({ length: 6 }, (_, i) => i);

  const { data, isLoading } = useQuerySingleUser({ username });

  if (isLoading) {
    return (
      <div className='grid grid-cols-3 gap-x-4 gap-y-6 pt-8 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-8 xl:grid-cols-5'>
        {skeletonArr.map((_skeleton, i) => (
          <Card key={i} className='h-60'>
            <Skeleton className='h-full' animationDelay={`0.${i}s`} />
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex h-96 flex-col items-center justify-center'>
        <p className='text-2xl font-bold text-gray-400'>No listings found</p>
        <Button variant='outline' onClick={() => router.refresh()}>
          Try again
        </Button>
      </div>
    );
  }

  const activeListings = data.listings?.filter((listing) => {
    return listing.endsAt > new Date().toISOString();
  });

  return (
    <div className='grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 md:gap-x-6 lg:grid-cols-5 lg:gap-y-8 xl:grid-cols-6'>
      {activeListings?.map(({ title, media, id, endsAt }, i) => (
        <Card
          key={id}
          className='relative flex flex-col overflow-hidden bg-secondary'
        >
          <CardHeader className='flex flex-row items-center justify-between p-2'>
            <CardTitle className='text-lg font-bold text-secondary-foreground lg:text-2xl'>
              <Link href={`/item/${id}`} className='line-clamp-1'>
                {title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className='grid flex-1 p-2'>
            <div className='flex aspect-[16/10] items-center overflow-hidden rounded-md'>
              <Link href={`/item/${id}`} className='w-full'>
                <Image
                  src={media.at(0) || fallbackImg}
                  width={600}
                  height={400}
                  alt='Product Image'
                  className='w-full'
                />
              </Link>
            </div>

            <div className='flex-1' />
            <div className='flex items-center justify-between pb-4 sm:flex-col sm:items-start sm:justify-start'>
              <EndingTime endsAt={endsAt} />
            </div>
            <AnimatedButton
              isLink
              href={`/item/${id}`}
              variant='outline'
              className='w-full border-accent-600 bg-transparent'
            >
              See more
            </AnimatedButton>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserListingsGrid;
