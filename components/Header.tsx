import Hammer from '@/public/CrazyAuction-hammer.svg';
import Logo from '@/public/CrazyAuction-no-outline-no-hammer.svg';
import Image from 'next/image';
import Link from 'next/link';
import HeaderLine from './HeaderLine';
import HeaderLinks from './HeaderLinks';
import SearchInput from './Search';
import UserMenu from './UserMenu';

const Header = () => {
  return (
    <header className='sticky top-0 z-50 flex flex-col items-center justify-center bg-background bg-opacity-90 backdrop-blur-lg'>
      <div className='flex h-12 w-full max-w-8xl items-center justify-between px-4 sm:h-16 md:px-6'>
        <nav className='flex flex-row items-center gap-6 bg-opacity-100 text-lg font-medium lg:gap-8'>
          <Link
            className='flex items-center gap-2 text-lg font-semibold text-accent'
            href='/'
          >
            <div className='hidden sm:block'>
              <Image src={Logo} alt='CrazyAuction' width={64} height={64} />
            </div>
            <div className='sm:hidden'>
              <Image src={Hammer} alt='CrazyAuction' width={50} height={50} />
            </div>
            <span className='sr-only'>CrazyAuction</span>
          </Link>
          <HeaderLinks />
        </nav>
        <SearchInput />

        <div className='flex gap-4'>
          <UserMenu />
        </div>
      </div>

      <HeaderLine />
    </header>
  );
};

export default Header;
