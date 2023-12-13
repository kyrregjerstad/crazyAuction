export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/user/:path*', '/auction/:path*', '/leaderboard/:path*'],
};
