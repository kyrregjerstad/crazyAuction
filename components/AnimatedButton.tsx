import { motion } from 'framer-motion';
import Link from 'next/link';

import React from 'react';
import {
  ButtonProps,
  buttonVariants,
  Button,
  ButtonVariants,
} from './ui/button';
import { cn } from '@/lib/utils';

type Props = ButtonProps &
  (
    | { isLink: true; href: string; variant: ButtonVariants; repeat?: boolean }
    | {
        isLink?: false;
        href?: never;
        variant?: ButtonVariants;
        repeat?: boolean;
      }
  );

const AnimatedButton = ({
  isLink,
  href,
  children,
  variant,
  repeat,
  ...rest
}: Props) => {
  return (
    <div className={cn('relative', rest.className)}>
      <motion.div
        whileHover={{
          scale: 1.055,
          transition: {
            delay: 0.2,
            duration: repeat ? 0.6 : 0.3,
            repeat: repeat ? Infinity : 0,
            repeatType: 'mirror',
          },
        }}
        whileTap={{ scale: 0.9 }}
        className='w-full'
      >
        {isLink ? (
          <Link
            href={href}
            className={cn(buttonVariants({ variant }), rest.className)}
          >
            {children}
          </Link>
        ) : (
          <Button variant={variant} {...rest}>
            {children}
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default AnimatedButton;
