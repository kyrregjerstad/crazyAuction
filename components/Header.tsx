import Link from 'next/link';
import { Button } from './ui/button';

const Header = () => {
  return (
    <header className='sticky top-0 flex h-16 items-center justify-between border-b border-accent bg-background px-4 md:px-6'>
      <nav className='flex flex-row items-center gap-6 text-lg font-medium lg:gap-8'>
        <Link
          className='flex items-center gap-2 text-lg font-semibold text-accent'
          href='#'
        >
          Home icon
          <span className='sr-only'>FastBid</span>
        </Link>
        <Link className='text-accent' href='#'>
          Auctions
        </Link>
      </nav>

      <Button className='rounded-full' variant='ghost'>
        Profile
        <span className='sr-only'>User profile</span>
      </Button>
    </header>
  );
};

export default Header;
