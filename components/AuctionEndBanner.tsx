'use client';
import { TimeIntervals } from '@/lib/data/generateSampleData';
import dayjs from 'dayjs';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

type AuctionEndedBannerProps = {
  endsAt: string;
};

const AuctionEndedBanner = ({ endsAt }: AuctionEndedBannerProps) => {
  const controller = useAnimation();

  // using a callback instead of continuously checking the time
  useEffect(() => {
    const now = dayjs();
    const endsTime = dayjs(endsAt);
    const timeLeft = endsTime.diff(now);

    if (timeLeft > 0 && timeLeft < TimeIntervals.oneHour) {
      const timeout = setTimeout(() => {
        controller.start({
          scale: 1,
          opacity: 1,
          transition: {
            duration: 0.5,
          },
        });
      }, timeLeft);

      return () => clearTimeout(timeout);
    }

    if (timeLeft <= 0) {
      controller.start({
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0,
        },
      });
    }
  }, [endsAt, controller]);

  return (
    <>
      <motion.div
        key={1}
        initial={{ scale: 5, opacity: 0 }}
        animate={controller}
      >
        <div className='pointer-events-none absolute right-0 top-0 translate-x-14 translate-y-8 rotate-45 border border-accent bg-background p-2 px-12 text-center text-sm uppercase drop-shadow-md sm:text-base'>
          auction ended
        </div>
      </motion.div>
    </>
  );
};

export default AuctionEndedBanner;
