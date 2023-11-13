import AuctionItemCard from '@/components/auctionItemCard';
import { Button } from '@/components/ui/button';
import useGetAllAuctionItems from '@/lib/hooks/useGetAllAuctionItems';
import Image from 'next/image';

export default async function Home() {
  const listings = await useGetAllAuctionItems();

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {listings.map((listing) => (
        <AuctionItemCard key={listing.id} listing={listing} />
      ))}
    </main>
  );
}
