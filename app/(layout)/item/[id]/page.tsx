import authOptions from '@/app/(auth)/authOptions';

import { getSingleAuction } from '@/lib/services/auction-api/getSingleAuction';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata, ResolvingMetadata } from 'next';
import { getServerSession } from 'next-auth/next';
import SingleAuctionPage from './Listing';
import { redirect } from 'next/navigation';

type Props = {
  params: { id: string };
};

const ItemDetailsPage = async ({ params: { id } }: Props) => {
  const session = await getServerSession(authOptions);
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['singleAuction', id],
      queryFn: () => getSingleAuction(id),
    });
  } catch (error) {
    console.log(error);
    redirect('/404');
  }

  return (
    <div className='mx-auto max-w-5xl p-8'>
      <div className='grid items-start gap-8 md:grid-cols-2'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SingleAuctionPage
            auctionId={id}
            isAuthenticated={!!session?.user.name}
          />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default ItemDetailsPage;

export const dynamic = 'force-dynamic';

type GenerateMetaProps = {
  params: { id: string };
  searchParams: { sort: string; order: string };
};

export async function generateMetadata(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { params, searchParams }: GenerateMetaProps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = params.id;

  const auction = await getSingleAuction(id);

  return {
    title: `${auction?.title} | CrazyAuction`,
    description: auction?.description,
  };
}
