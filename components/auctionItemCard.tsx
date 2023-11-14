import React from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Listing } from '@/lib/schemas/listing';
import Link from 'next/link';
import Image from './Image';

type Props = {
  listing: Listing;
};

const AuctionItemCard = ({ listing }: Props) => {
  return (
    <Card className='bg-secondary'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-2xl font-bold text-secondary-foreground'>
          <Link href={`/item/${listing.id}`}>{listing.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          src={listing.media[0] || ''}
          width={500}
          height={500}
          alt='Product Image'
        />

        <p className='mt-2 max-h-[50px] overflow-hidden overflow-ellipsis text-xs text-gray-400'>
          {listing.description}
        </p>
        <p className='mt-2 text-xs text-gray-400'>
          Starting bid: {listing.bids[0]?.amount || 'none'}
        </p>
        <Button
          className='mt-4 border border-accent bg-transparent text-secondary-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground'
          size='lg'
        >
          Bid now
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuctionItemCard;
