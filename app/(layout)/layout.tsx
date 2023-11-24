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
      <main className='flex min-h-screen flex-col items-center justify-between'>
        {children}
      </main>
    </>
  );
}
