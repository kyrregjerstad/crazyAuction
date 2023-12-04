'use client';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

// This has to be a separate component because useFormStatus() can't be called inside a component that is a child of a form.
// see: https://react.dev/reference/react-dom/hooks/useFormStatus

type Props = {
  disabled: boolean;
};
const SubmitBtn = ({ disabled }: Props) => {
  const { pending, data, method } = useFormStatus();

  return (
    <Button type='submit' variant='outline' disabled={pending || disabled}>
      {pending ? 'Uploading...' : 'Upload'}
    </Button>
  );
};

export default SubmitBtn;
