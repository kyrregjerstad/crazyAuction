'use client';
import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { pickRandom, rotateVariations, xVariations } from '@/lib/animation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import useRegisterForm from '@/lib/hooks/forms/useRegisterForm';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const RegisterForm = () => {
  const { form, registerUser } = useRegisterForm();
  const animationControl = useAnimation();

  const {
    control,
    watch,
    formState: { isSubmitting, isDirty, isSubmitSuccessful, errors },
  } = form;

  const name = watch('name');
  const avatarUrl = watch('avatar');
  const firstLetter = name && name.length > 0 ? name[0].toUpperCase() : '';

  useEffect(() => {
    if (!errors.root) return;
    animationControl.start({
      x: pickRandom(xVariations),
      rotate: pickRandom(rotateVariations),
      transition: {
        duration: 0.5,
        repeatType: 'mirror',
      },
    });
  }, [errors.root, animationControl]);

  return (
    <>
      <div className='flex w-full items-center justify-start gap-4 sm:flex-col'>
        <Avatar className='h-16 w-16 border-2 border-accent text-5xl sm:h-28 sm:w-28'>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{firstLetter}</AvatarFallback>
        </Avatar>
        <h1 className='text-center  text-3xl font-bold'>Register</h1>
      </div>
      <Form {...form}>
        <form className='space-y-4 pb-16' onSubmit={registerUser}>
          <FormField
            control={control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Your name' type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Your email' type='email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Your password'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='repeatPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Confirmation</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Repeat password'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='avatar'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input placeholder='Avatar Url' type='url' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <motion.div animate={animationControl}>
            <Button
              className='w-full bg-accent'
              type='submit'
              disabled={isSubmitting || !isDirty || isSubmitSuccessful}
            >
              <span id='confetti' />
              {isSubmitting ? (
                <Spinner />
              ) : isSubmitSuccessful ? (
                'Registered! 🎉'
              ) : (
                'Register'
              )}
            </Button>
          </motion.div>
          {errors.root && (
            <p className='text-center text-destructive'>
              {errors.root.message}
            </p>
          )}
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;
