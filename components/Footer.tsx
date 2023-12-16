import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className='mt-12 flex w-full items-center justify-center border-t border-accent-500 py-8'>
      <div className='opacity-50'>CrazyAuction - {currentYear}</div>
    </footer>
  );
};

export default Footer;
