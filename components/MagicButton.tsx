import { motion } from 'framer-motion';
import Link from 'next/link';
import { buttonVariants } from './ui/button';

const MagicButton = () => {
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
      whileTap={{ scale: 0.9, rotate: 0 }}
      className='relative'
    >
      <Link className={buttonVariants({ variant: 'magic' })} href='/new'>
        New Auction
      </Link>
    </motion.div>
  );
};

export default MagicButton;
