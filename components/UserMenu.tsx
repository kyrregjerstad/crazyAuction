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
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';

const UserMenu = () => {
  const { data, status } = useSession();
  const avatarUrl = data?.user.avatar;

  return (
    <>
      {status === 'authenticated' ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>
              <Link href='/api/auth/signout'>Log out</Link>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href='/api/auth/signin'>
          <Button>Sign in</Button>
        </Link>
      )}
    </>
  );
};

export default UserMenu;
