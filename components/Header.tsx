import Link from 'next/link';
import UserMenu from './UserMenu';
import Logo from './Logo';
import { buttonVariants } from '@/components/ui/button';

const Header = () => {
  return (
    <header className='sticky top-0 flex h-16 items-center justify-between border-b border-accent bg-background px-4 md:px-6'>
      <nav className='flex flex-row items-center gap-6 text-lg font-medium lg:gap-8'>
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
    </header>
  );
};

export default Header;
