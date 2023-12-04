'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from './Image';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const ImageGallery = ({ images }: { images: string[] }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImage(index);
  };

  const imageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <>
      {images.length === 0 ? (
        <div className='aspect-w-1 aspect-h-2 md:aspect-h-1 relative'>
          <div className='aspect-square rounded-lg object-cover'>
            <Image
              src='/fallback-image.webp'
              width={500}
              height={500}
              className='aspect-square rounded-lg object-cover'
              alt='Fallback image'
            />
          </div>
        </div>
      ) : (
        <div className='relative space-y-4'>
          <div className='aspect-w-1 aspect-h-2 md:aspect-h-1 relative'>
            <motion.div
              key={currentImage}
              variants={imageVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              transition={{ duration: 0.4 }}
              className='aspect-square rounded-lg object-cover'
            >
              <Image
                src={images[currentImage] || ''}
                width={500}
                height={500}
                className='aspect-square w-full rounded-lg object-cover'
                alt='Product Image'
              />
            </motion.div>

            {images.length > 1 && (
              <>
                <PrevBtn handlePrev={handlePrev} />
                <NextBtn handleNext={handleNext} />
              </>
            )}
          </div>
          <div className='grid w-full grid-cols-4 gap-4'>
            {images.map((img, index) => (
              <div
                key={index}
                className={cn('cursor-pointer overflow-hidden rounded-lg', {
                  'ring-1 ring-accent': index === currentImage,
                })}
                onClick={() => selectImage(index)}
              >
                <Image
                  src={img}
                  width={200}
                  height={100}
                  className='h-full w-full object-cover'
                  alt={`Product Thumbnail ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;

type NextBtnProps = {
  handleNext: () => void;
};

const NextBtn = ({ handleNext }: NextBtnProps) => {
  return (
    <Button
      onClick={handleNext}
      className='absolute right-0 top-1/2 h-20 w-20 -translate-y-1/2 transform rounded-l-lg bg-black bg-opacity-50 p-2 text-white 
      md:h-10 md:w-10'
    >
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
    </Button>
  );
};

type PrevBtnProps = {
  handlePrev: () => void;
};

const PrevBtn = ({ handlePrev }: PrevBtnProps) => {
  return (
    <Button
      onClick={handlePrev}
      className='absolute left-0 top-1/2 h-20 w-20 -translate-y-1/2 transform rounded-r-lg bg-black bg-opacity-50 p-2 text-white md:h-10 md:w-10'
    >
      <svg
        className='h-6 w-6'
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
    </Button>
  );
};
