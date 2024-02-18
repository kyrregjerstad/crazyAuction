import Header from '@/components/Header';
import '../globals.css';
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
      <main className='flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-between'>
        {children}
      </main>
      <Footer />
    </>
  );
}
