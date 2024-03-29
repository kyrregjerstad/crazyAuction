import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {/* 4 rem is the size of the header */}
      <main className='flex min-h-[100dvh-4rem] flex-col items-center justify-between'>
        {children}
      </main>
      <Footer />
    </>
  );
}
