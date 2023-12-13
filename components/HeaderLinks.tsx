'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
          } hidden transition-colors duration-200 sm:block`}
        >
          {name}
        </Link>
      ))}
    </>
  );
};

export default HeaderLinks;
