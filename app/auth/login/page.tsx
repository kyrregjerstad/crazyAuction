'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';
import Logo from '@/public/CrazyAuction-no-outline.svg';

const page = () => {
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { email, password } = event.currentTarget;

    await signIn('credentials', {
      email: email.value,
      password: password.value,
      redirect: true,
      callbackUrl: '/',
    });
  };

  return (
    <div className='mx-auto w-full max-w-md space-y-6 pt-24'>
      <div className='flex items-center justify-center'>
        <Image src={Logo} width={300} height={300} alt='crazy auction logo' />
      </div>
      <h1 className='text-center text-3xl font-bold'>Login to CrazyAuction</h1>
      <form className='space-y-4' onSubmit={onSubmit}>
        <div className='space-y-2'>
          <Label htmlFor='email'>email</Label>
          <Input
            className='bg-black text-foreground'
            id='email'
            type='email'
            placeholder='@noroff.no'
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='password'>password</Label>
          <Input
            className='bg-black text-foreground'
            id='password'
            required
            type='password'
          />
        </div>
        <Button className='w-full bg-accent' type='submit'>
          Login
        </Button>
      </form>
    </div>
  );
};

export default page;
