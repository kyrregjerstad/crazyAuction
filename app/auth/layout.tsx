import Link from 'next/link';
import '../globals.css';
import Logo from '@/public/CrazyAuction-no-outline-no-hammer.svg';
import Image from 'next/image';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className='flex min-h-screen flex-col items-center justify-between'>
        {children}
      </main>
    </>
  );
}

const Header = () => {
  return (
    <header className='sticky top-0 z-50 flex  flex-col items-center justify-center border-b border-accent bg-background bg-opacity-90 backdrop-blur-lg'>
      <div className='flex h-16 w-full max-w-8xl items-center justify-between px-4 md:px-6'>
        <nav className='flex flex-row items-center gap-6 bg-opacity-100 text-lg font-medium lg:gap-8'>
          <Link
            className='flex items-center gap-2 text-lg font-semibold text-accent'
            href='/'
          >
            <Image src={Logo} alt='CrazyAuction' width={64} height={64} />

            <span className='sr-only'>Crazy Auction</span>
          </Link>
        </nav>
        <div className='flex gap-4'>
          <Link href='/auth/login'>Login</Link>
          <Link href='/auth/register'>Register</Link>
        </div>
      </div>
    </header>
  );
};
