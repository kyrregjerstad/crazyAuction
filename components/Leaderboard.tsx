'use client';

import getAllUsers from '@/lib/services/getAllUsers';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { useClientJWT } from '@/lib/hooks/useClientJWT';

const Leaderboard = () => {
  const jwt = useClientJWT();

  const { data: users, isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => getAllUsers({ jwt }),
  });

  if (!users) {
    return null;
  }

  return (
    <div className='rounded-lg border border-accent shadow-sm'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className=''>#</TableHead>
            <TableHead className='w-1/4'>User</TableHead>
            <TableHead className='w-1/4'>Credits</TableHead>
            <TableHead className='w-1/4'>Auctions</TableHead>
            <TableHead className='w-1/4'>Winning Auctions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.name}>
              <TableCell className='text-neutral-400'>#{index + 1}</TableCell>
              <TableCell className='flex items-center space-x-2 font-medium'>
                <Avatar>
                  <AvatarImage src={user.avatar || ''} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Link
                  href={`/user/${user.name}`}
                  className='flex items-center justify-center gap-2'
                >
                  {user.name}
                  <Trophy index={index} />
                </Link>
              </TableCell>
              <TableCell>${user.credits}</TableCell>
              <TableCell>{user._count.listings}</TableCell>
              <TableCell>{user.listings?.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leaderboard;

const Trophy = ({ index }: { index: number }) => {
  if (index === 0) {
    return <div className='text-2xl'>🏆</div>;
  } else {
    return null;
  }
};
