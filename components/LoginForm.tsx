'use client';
import useLoginForm from '@/lib/hooks/forms/useLoginForm';
import { motion, useAnimation } from 'framer-motion';
import Spinner from './Spinner';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { useEffect } from 'react';
import { pickRandom, rotateVariations, xVariations } from '@/lib/animation';

const LoginForm = () => {
  const { form, handleLogin } = useLoginForm();

  const animationControl = useAnimation();

  const {
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = form;

  // This is the animation that is triggered when the email/password is incorrect
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
    <Form {...form}>
      <form className='space-y-6' onSubmit={handleLogin}>
        <FormField
          control={control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='@noroff.no'
                  type='email'
                  className='bg-foreground text-background'
                />
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
                  {...field}
                  type='password'
                  className='bg-foreground text-background'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <motion.div animate={animationControl}>
          <Button
            className='w-full rounded-md bg-accent px-4 py-2 text-white hover:bg-accent'
            type='submit'
          >
            {isSubmitting ? (
              <Spinner />
            ) : isSubmitSuccessful ? (
              'Success!'
            ) : (
              'Login'
            )}
          </Button>
        </motion.div>
        {errors.root && (
          <p className='text-center text-destructive'>{errors.root.message}</p>
        )}
      </form>
    </Form>
  );
};

export default LoginForm;
