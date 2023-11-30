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
import { Textarea } from '@/components/ui/textarea';
import useContactForm from '@/lib/hooks/forms/useContactForm';
import React from 'react';

const ContactForm = () => {
  const { form } = useContactForm();

  const {
    control,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
  } = form;

  return (
    <div className='flex w-full flex-col items-center gap-4'>
      <Form {...form}>
        <form className='gap- flex w-full max-w-lg flex-col gap-4'>
          <FormField
            control={control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Name'
                    {...field}
                    className='bg-foreground text-background'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='subject'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Subject'
                    {...field}
                    className='bg-foreground text-background'
                  />
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
                  <Input
                    placeholder='Email'
                    {...field}
                    className='bg-foreground text-background'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='message'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Message'
                    {...field}
                    className='bg-foreground text-background'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex w-full items-center justify-center'>
            <Button
              disabled={isSubmitting || isSubmitSuccessful || !isDirty}
              className='w-full'
            >
              {isSubmitting ? <Spinner /> : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
