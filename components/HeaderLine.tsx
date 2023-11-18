'use client';

import React, { useEffect, useState } from 'react';

const useHasScrolled = ({ threshold = 0 }) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > threshold) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return hasScrolled;
};

const HeaderLine = () => {
  const hasScrolled = useHasScrolled({ threshold: 20 });

  return (
    <div
      className={`${
        hasScrolled ? 'opacity-100' : 'opacity-0'
      }  w-full border-b border-accent  transition-opacity duration-500 ease-in-out`}
    />
  );
};

export default HeaderLine;
