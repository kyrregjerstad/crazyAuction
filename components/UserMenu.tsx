'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MagicButton from './MagicButton';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button, buttonVariants } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const UserMenu = () => {
  const { data, status } = useSession();
  const avatarUrl = data?.user.avatar;
  const pathname = usePathname();

  return (
    <>
      {status === 'authenticated' ? (
        <>
          <div className='hidden sm:block'>
            {pathname !== '/auction' && <MagicButton />}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger data-testid='user-menu-trigger'>
              <Avatar className='border-2 border-accent transition-transform hover:scale-110'>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>CA</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem asChild>
                <Link
                  href='/auction?mode=create'
                  className='flex w-full justify-end p-0 py-2 sm:hidden'
                  data-testid='new-auction-menu-link'
                >
                  New Auction
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href='/leaderboard'
                  className='flex w-full justify-end p-0 py-2 md:hidden'
                >
                  Leaderboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/user/${data.user.name}`}
                  className='flex w-full justify-end p-0 py-2'
                >
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button
                  onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                  variant='text'
                  className='flex w-full justify-end p-0 px-2'
                >
                  Log out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Link
            href='/login'
            className={buttonVariants({ variant: 'outline' })}
          >
            Login
          </Link>
          <Link
            href='/register'
            className={buttonVariants({ variant: 'accent' })}
          >
            Register
          </Link>
        </>
      )}
    </>
  );
};

export default UserMenu;
