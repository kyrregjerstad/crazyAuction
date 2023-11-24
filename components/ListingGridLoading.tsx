import Skeleton from '@/components/Skeleton';
import { Card } from './ui/card';

const ListingsGridLoading = () => {
  const skeletonArr = Array.from({ length: 30 }, (_, i) => i);

  return (
    <>
      <div className='grid grid-cols-1 gap-x-4 gap-y-6 pt-8 sm:grid-cols-2 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-y-8 xl:grid-cols-5'>
        {skeletonArr.map((skeleton, i) => (
          <Card key={i} className='h-96'>
            <Skeleton className='h-full' />
          </Card>
        ))}
      </div>
    </>
  );
};

export default ListingsGridLoading;
