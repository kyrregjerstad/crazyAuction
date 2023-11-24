'use client';
import LoginForm from '@/components/LoginForm';
import Logo from '@/public/CrazyAuction-no-outline.svg';
import Image from 'next/image';

const page = () => {
  return (
    <div className='mx-auto w-full max-w-md space-y-6 pt-24'>
      <div className='flex items-center justify-center'>
        <Image src={Logo} width={300} height={300} alt='crazy auction logo' />
      </div>
      <h1 className='text-center text-3xl font-bold'>Login to CrazyAuction</h1>
      <LoginForm />
    </div>
  );
};

export default page;
