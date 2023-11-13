import LoginForm from '@/components/LoginForm';

export default async function LoginPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background text-white'>
      <div className='w-full max-w-md'>
        <div className='mb-4 text-center text-3xl text-accent'>Login</div>
        <LoginForm />
      </div>
    </div>
  );
}
