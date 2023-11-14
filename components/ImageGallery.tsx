'use client';

import { useState } from 'react';

const ImageGallery = ({ images }: { images: string[] }) => {
  const imageAmount = images.length;
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <>
      <div className='relative space-y-4'>
        <div className='aspect-w-1 aspect-h-2 md:aspect-h-1 relative'>
          <img
            alt='Product Image Main'
            className='rounded-lg object-cover'
            height='500'
            src={images.at(0) || ''}
            style={{
              aspectRatio: '1',
              objectFit: 'cover',
            }}
            width='500'
          />
          <button className='absolute left-0 top-1/2 -translate-y-1/2 transform rounded-r-lg bg-black bg-opacity-50 p-2 text-white'>
            <svg
              className=' h-6 w-6'
              fill='none'
              height='24'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='m15 18-6-6 6-6' />
            </svg>
          </button>
          <button className='absolute right-0 top-1/2 -translate-y-1/2 transform rounded-l-lg bg-black bg-opacity-50 p-2 text-white'>
            <svg
              className=' h-6 w-6'
              fill='none'
              height='24'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
              width='24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='m9 18 6-6-6-6' />
            </svg>
          </button>
        </div>
        <div className='grid grid-cols-3 gap-2'>
          <div className='aspect-w-1 aspect-h-1'>
            <img
              alt='Product Image 1'
              className='cursor-pointer rounded-lg object-cover'
              height='200'
              src={images.at(1) || ''}
              style={{
                aspectRatio: '1',
                objectFit: 'cover',
              }}
              width='200'
            />
          </div>
          <div className='aspect-w-1 aspect-h-1'>
            <img
              alt='Product Image 2'
              className='cursor-pointer rounded-lg object-cover'
              height='200'
              src={images.at(2) || ''}
              style={{
                aspectRatio: '1',
                objectFit: 'cover',
              }}
              width='200'
            />
          </div>
          <div className='aspect-w-1 aspect-h-1'>
            <img
              alt='Product Image 3'
              className='cursor-pointer rounded-lg object-cover'
              height='200'
              src={images.at(3) || ''}
              style={{
                aspectRatio: '1',
                objectFit: 'cover',
              }}
              width='200'
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageGallery;
