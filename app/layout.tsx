import './globals.css';
import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@/components/ui/toaster';
import { pageMetaData } from '@/lib/data/metadata';
import { Analytics } from './Analytics';
import QueryClientProvider from './providers/QueryClientProvider';
import AuthProvider from './(auth)/Provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Analytics />
      <html
        lang='en'
        className={`${GeistSans.variable} ${GeistMono.variable} dark`}
      >
        <body>
          <QueryClientProvider>
            <AuthProvider>
              {children}
              <SpeedInsights />
              <Toaster />
            </AuthProvider>
          </QueryClientProvider>
        </body>
      </html>
    </>
  );
}

export const metadata: Metadata = {
  ...pageMetaData,
};
