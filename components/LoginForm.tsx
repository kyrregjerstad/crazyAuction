'use client';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

const LoginForm = () => {
  return (
    <form className='space-y-6'>
      <div>
        <label className='block text-sm font-medium' htmlFor='email'>
          Email
        </label>
        <input
          className='mt-2 w-full rounded-md border border-accent bg-card px-4 py-2 text-white'
          id='email'
          required
          type='email'
        />
      </div>
      <div>
        <label className='block text-sm font-medium' htmlFor='password'>
          Password
        </label>
        <input
          className='mt-2 w-full rounded-md border border-accent bg-card px-4 py-2 text-white '
          id='password'
          required
          type='password'
        />
      </div>
      <Link href='/api/auth/signin'>
        <Button
          className='w-full rounded-md bg-accent px-4 py-2 text-white hover:bg-accent'
          type='submit'
        >
          Login
        </Button>
      </Link>
    </form>
  );
};

export default LoginForm;
