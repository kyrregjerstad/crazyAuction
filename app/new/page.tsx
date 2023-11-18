import NewAuctionForm from '@/components/NewAuctionForm';

export default function NewAuctionPage() {
  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='my-8 text-2xl font-bold md:text-4xl lg:text-5xl'>
          Create a New Auction
        </h1>
        <NewAuctionForm />
      </div>
    </>
  );
}
