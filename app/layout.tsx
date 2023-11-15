import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Header from '@/components/Header';
import AuthProvider from './auth/Provider';
import QueryClientProvider from './providers/QueryClientProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
    >
      <body>
        <QueryClientProvider>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
