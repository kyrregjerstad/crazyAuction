'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import React from 'react';

const pages = [
  {
    name: 'Auctions',
    href: '/',
  },
  {
    name: 'Leaderboard',
    href: '/leaderboard',
  },
];

const HeaderLinks = () => {
  const searchParams = useSearchParams();
  const currentPath = usePathname();

  return (
    <>
      {pages.map(({ name, href }) => (
        <Link
          key={name}
          href={href}
          className={`${
            href === currentPath
              ? 'text-accent'
              : 'font-medium text-neutral-300'
          } transition-colors duration-200 `}
        >
          {name}
        </Link>
      ))}
    </>
  );
};

export default HeaderLinks;
