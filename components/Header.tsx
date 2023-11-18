import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import HeaderLine from './HeaderLine';
import UserMenu from './UserMenu';

const Header = () => {
  return (
    <header className='z-1000 sticky top-0 bg-background bg-opacity-90  backdrop-blur-lg '>
      <div className='flex h-16 items-center justify-between px-4 md:px-6'>
        <nav className='flex flex-row items-center gap-6 bg-opacity-100 text-lg font-medium lg:gap-8'>
          <Link
            className='flex items-center gap-2 text-lg font-semibold text-accent'
            href='/'
          >
            Crazy Auction
            <span className='sr-only'>FastBid</span>
          </Link>
          <Link className='text-accent' href='/'>
            Auctions
          </Link>
        </nav>

        <div className='flex gap-4'>
          <Link className={buttonVariants({ variant: 'outline' })} href='/new'>
            New Auction
          </Link>

          <UserMenu />
        </div>
      </div>

      <HeaderLine />
    </header>
  );
};

export default Header;
