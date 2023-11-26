import { motion } from 'framer-motion';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import Sparkles from './Sparkles';
import { useState } from 'react';

const MagicButton = () => {
  const [animate, setAnimate] = useState(false);

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        rotate: [0, 1, -1, 5, -1, 0],
        transition: {
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'mirror',
        },
      }}
      onMouseOver={() => setAnimate(true)}
      onMouseLeave={() => setAnimate(false)}
      whileTap={{ scale: 0.9, rotate: 0 }}
      className='relative'
    >
      <Link
        className={buttonVariants({ variant: 'magic' })}
        href='/auction?create'
      >
        <Sparkles animate={animate}>New Auction</Sparkles>
      </Link>
    </motion.div>
  );
};

export default MagicButton;
