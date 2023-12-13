import { Auction, AuctionFull } from '@/lib/schemas';
import fallbackImg from '@/public/fallback-image.webp';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import AnimatedButton from './AnimatedButton';
import AuctionEndedBanner from './AuctionEndBanner';
import EndingTime from './EndingTime';
import Image from './Image';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

dayjs.extend(relativeTime);

type Props = {
  listing: Auction | AuctionFull;
};

const AuctionItemCard = ({ listing }: Props) => {
  const { id, title, media, description, endsAt } = listing;

  let bids;
  if ('bids' in listing) {
    bids = listing.bids;
  }

  return (
    <Card className='relative flex flex-col overflow-hidden'>
      <AuctionEndedBanner endsAt={endsAt} />
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-lg font-bold text-secondary-foreground lg:text-2xl'>
          <Link href={`/item/${id}`} className='line-clamp-1'>
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className='grid flex-1 '>
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

        <p className='mt-2 line-clamp-2 max-h-[50px] text-gray-400 sm:text-sm md:text-lg'>
          {description}
        </p>
        <div className='flex-1' />
        <div className='flex items-center justify-between pb-4 sm:flex-col sm:items-start sm:justify-start'>
          <p className='mt-2 text-xl text-card-foreground'>
            ${bids?.at(-1)?.amount || '0'}
          </p>
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
  );
};

export default AuctionItemCard;
