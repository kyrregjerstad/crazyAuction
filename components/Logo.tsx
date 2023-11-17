import Image from 'next/image';
import * as React from 'react';
import svgLogo from '@/public/logo-1.svg';
const Logo = () => {
  return <Image src={svgLogo} width={100} alt='test'></Image>;
};
export default Logo;
