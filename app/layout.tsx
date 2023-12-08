import { Toaster } from '@/components/ui/toaster';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import Script from 'next/script';
import AuthProvider from './auth/Provider';
import './globals.css';
import QueryClientProvider from './providers/QueryClientProvider';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script id='hotjar'>
        {`(function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:3751458,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
      </Script>
      <html
        lang='en'
        className={`${GeistSans.variable} ${GeistMono.variable} dark`}
      >
        <body>
          <QueryClientProvider>
            <AuthProvider>
              {/* <Header /> */}
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
