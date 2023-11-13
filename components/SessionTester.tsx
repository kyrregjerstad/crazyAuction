'use client';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import React from 'react';

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
