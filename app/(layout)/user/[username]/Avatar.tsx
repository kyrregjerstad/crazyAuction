'use client';
import Spinner from '@/components/Spinner';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useUpdateAvatarForm from '@/lib/hooks/forms/useAvatarForm';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { useState } from 'react';

type Props = {
  children: React.ReactNode;
  canEdit: boolean;
};

const AvatarWithEdit = ({ children, canEdit = false }: Props) => {
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      {canEdit ? (
        <div className='relative rounded-full border-2 border-accent'>
          <LinkPopover setEditMode={setEditMode} editMode={editMode} />
          <div
            className={cn(
              'transition-all duration-500 peer-hover:opacity-50 peer-hover:blur-sm',
              editMode && 'opacity-50 blur-sm',
            )}
          >
            {children}
          </div>
        </div>
      ) : (
        <div className='relative rounded-full border-2 border-accent'>
          {children}
        </div>
      )}
    </>
  );
};

export default AvatarWithEdit;

type LinkPopoverProps = {
  editMode: boolean;
  setEditMode: (value: boolean) => void;
};
const LinkPopover = ({ editMode, setEditMode }: LinkPopoverProps) => {
  const { form, handleUpdateAvatar } = useUpdateAvatarForm();

  const {
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = form;

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({
            variant: 'link',
          }),
          'peer absolute inset-0 z-30 mx-auto my-auto h-full w-full opacity-0 transition-all duration-500 hover:opacity-100',
          editMode && 'opacity-100',
        )}
        onClick={() => setEditMode(true)}
      >
        Edit
      </PopoverTrigger>
      <PopoverContent
        className='flex flex-col gap-4 rounded-md border border-neutral-700 bg-background p-4 shadow-md'
        side='right'
        onCloseAutoFocus={() => setEditMode(false)}
      >
        <Form {...form}>
          <form onSubmit={handleUpdateAvatar} className='flex flex-col gap-1'>
            <FormField
              control={control}
              name='avatar'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='https://'
                      type='url'
                      className='bg-foreground text-background'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full bg-accent'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner />
              ) : isSubmitSuccessful ? (
                'Success!'
              ) : (
                'Update'
              )}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};
