import Link from 'next/link';
import HeaderLine from './HeaderLine';
import HeaderLinks from './HeaderLinks';
import UserMenu from './UserMenu';

type HeaderProps = {
  searchParams?: any;
};

const Header = () => {
  return (
    <header className='sticky top-0 z-50 flex  flex-col items-center justify-center bg-background bg-opacity-90 backdrop-blur-lg'>
      <div className='max-w-8xl flex h-16 w-full items-center justify-between px-4 md:px-6'>
        <nav className='flex flex-row items-center gap-6 bg-opacity-100 text-lg font-medium lg:gap-8'>
          <Link
            className='flex items-center gap-2 text-lg font-semibold text-accent'
            href='/'
          >
            Crazy Auction
            <span className='sr-only'>FastBid</span>
          </Link>
          <HeaderLinks />
        </nav>

        <div className='flex gap-4'>
          <UserMenu />
        </div>
      </div>

      <HeaderLine />
    </header>
  );
};

export default Header;
