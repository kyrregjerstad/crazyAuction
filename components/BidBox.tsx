'use client';

import { placeBid } from '@/lib/services/placeBid';
import { use, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';

type BidBoxProps = {
  listingId: string;
  currentBid: number;
};

const BidBox = ({ listingId, currentBid }: BidBoxProps) => {
  const { data } = useSession();
  const [amount, setAmount] = useState(currentBid + 1);

  if (!data?.user) return null;

  const handleSubmit = async () => {
    const res = await placeBid({
      listingId,
      amount,
      jwt: data?.user.accessToken,
    });
    console.log(res);
  };
  return (
    <div className='flex w-full max-w-sm items-center space-x-2'>
      <Input
        type='number'
        placeholder={`${currentBid + 1}`}
        className='w-24'
        min={currentBid + 1}
        onChange={(e) => setAmount(Number(e.target.value))}
        value={amount}
      />

      <Button
        className='bg-accent text-white'
        variant='default'
        onClick={handleSubmit}
      >
        Place a bid
      </Button>
    </div>
  );
};

export default BidBox;
