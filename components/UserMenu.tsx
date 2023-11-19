'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Button, buttonVariants } from './ui/button';

const UserMenu = () => {
  const { data, status } = useSession();
  const avatarUrl = data?.user.avatar;

  return (
    <>
      {status === 'authenticated' ? (
        <>
          <Link className={buttonVariants({ variant: 'outline' })} href='/new'>
            New Auction
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
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
        <Link
          href='/api/auth/signin'
          className={buttonVariants({ variant: 'accent' })}
        >
          Sign in
        </Link>
      )}
    </>
  );
};

export default UserMenu;
