'use client';

export default function Error({ statusCode, title }) {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center'>
      <h1 className='text-6xl font-bold'>{title}</h1>
      <p className='text-2xl'>
        {statusCode ? `An error ${statusCode} occurred` : ''}
      </p>
    </div>
  );
}
