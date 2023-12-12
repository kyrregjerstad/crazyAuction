'use client';

import { TimeIntervals } from '@/lib/data/generateSampleData';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';

import { useState, useEffect } from 'react';
import Sparkles from './Sparkles';

const EndingTime = ({ endsAt }: { endsAt: string }) => {
  const [hasMounted, setHasMounted] = useState(false);

  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft(endsAt));

  useEffect(() => {
    setHasMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endsAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  const isEndingSoon = timeLeft < TimeIntervals.oneHour;
  const isEnded = timeLeft <= 0;

  if (!hasMounted) {
    return null; // Don't render anything until the first to avoid hydration mismatch
  }

  if (isEnded) {
    return (
      <div className='flex gap-2 pt-2 text-gray-400'>
        Ended <FormattedTimeLeft timeLeft={timeLeft} endsAt={endsAt} /> ago
      </div>
    );
  }

  return (
    <div className='flex flex-col pt-2 text-gray-400 sm:flex-row sm:gap-2'>
      Ends in{' '}
      {isEndingSoon ? (
        <Countdown timeLeft={timeLeft} />
      ) : (
        <FormattedTimeLeft timeLeft={timeLeft} endsAt={endsAt} />
      )}
    </div>
  );
};

export default EndingTime;

const calculateTimeLeft = (endsAt: string): number => {
  const endTime = dayjs(endsAt).valueOf();
  const now = Date.now();
  return Math.max(endTime - now, 0);
};

const formatTimeLeft = (timeLeft: number): string => {
  if (timeLeft > 0) {
    const minutes = Math.floor(timeLeft / 1000 / 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }
  return '00:00';
};

const FormattedTimeLeft = ({
  timeLeft,
  endsAt,
}: {
  timeLeft: number;
  endsAt: string;
}) => {
  const isEndingSoon = timeLeft < TimeIntervals.twelveHours && timeLeft > 0;
  const endingTimeFormatted = dayjs(endsAt).fromNow(true);
  return (
    <span
      className={cn(isEndingSoon ? 'font-bold text-accent' : 'font-medium')}
    >
      {endingTimeFormatted}
    </span>
  );
};

const Countdown = ({ timeLeft }: { timeLeft: number }) => {
  const timeLeftString = formatTimeLeft(timeLeft);

  return (
    <div className='text-gray-400'>
      <Sparkles
        animate={timeLeft < TimeIntervals.oneMinute && timeLeft > 0}
        color='oklch(90% 0.25 9)'
        size={8}
      >
        <span
          className={cn(
            'font-mono font-bold text-accent',
            timeLeft < TimeIntervals.tenMinutes && 'animate-pulse',
          )}
        >
          {timeLeftString}
        </span>
      </Sparkles>
    </div>
  );
};
