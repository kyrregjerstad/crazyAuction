import Header from '@/components/Header';
import '../globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {/* 4 rem is the size of the header */}
      <main className='min-h-[100dvh - 4rem] flex flex-col items-center justify-between'>
        {children}
      </main>
    </>
  );
}
