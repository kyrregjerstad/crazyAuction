'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
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

  return (
    <>
      {status === 'authenticated' ? (
        <>
          <MagicButton />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className='border-2 border-accent transition-transform hover:scale-110'>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem asChild>
                <Link
                  href={`/user/${data.user.name}`}
                  className='flex w-full items-center justify-center p-0 py-2 text-center'
                >
                  My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button
                  onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                  variant='text'
                  className='w-full p-0 '
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
