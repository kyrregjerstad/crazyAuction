'use client';
import { useSession } from 'next-auth/react';

const SessionTester = () => {
  const session = useSession();

  console.log(session);
  return (
    <pre className='max-w-full overflow-auto whitespace-pre-wrap'>
      {JSON.stringify(session, undefined, 2)}
    </pre>
  );
};

export default SessionTester;
