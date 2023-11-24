'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button, buttonVariants } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import MagicButton from './MagicButton';

const UserMenu = () => {
  const { data, status } = useSession();
  const avatarUrl = data?.user.avatar;

  return (
    <>
      {status === 'authenticated' ? (
        <>
          {/* <Link className={buttonVariants({ variant: 'outline' })} href='/new'>
            New Auction
          </Link> */}
          <MagicButton />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className='border-2 border-accent transition-transform hover:scale-110'>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>
                <Link href={`/user/${data.user.name}`} className=''>
                  My Account
                </Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <Button
                  onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                  variant={'ghost'}
                  className='w-full'
                >
                  Log out
                </Button>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Link
            href='/auth/login'
            className={buttonVariants({ variant: 'outline' })}
          >
            Login
          </Link>
          <Link
            href='/auth/register'
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
