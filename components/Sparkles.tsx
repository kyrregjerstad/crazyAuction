import useRandomInterval from '@/lib/hooks/useRandomInterval';
import { random } from '@/lib/utils';
import React, { useState } from 'react';
// inspired by:
// https://www.joshwcomeau.com/react/animated-sparkles-in-react/

type Props = {
  children: React.ReactNode;
  animate?: boolean;
};

const Sparkles = ({ children, animate }: Props) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useRandomInterval(
    () => {
      const now = Date.now();
      const color = `oklch(${random(60, 68)}%, 0.27, ${random(8, 12)})`;
      const sparkle = generateSparkle(color);

      const nextSparkles = sparkles.filter((sparkle) => {
        const delta = now - sparkle.createdAt;
        return delta < 2100;
      });

      nextSparkles.push(sparkle);

      setSparkles(nextSparkles);
    },
    animate ? 100 : null,
    animate ? 500 : null,
  );

  return (
    <div className='relative inline-block'>
      {sparkles.map((sparkle) => (
        <SparkleInstance key={sparkle.id} {...sparkle} />
      ))}
      <div className='relative'>{children}</div>
    </div>
  );
};

export default Sparkles;

type SparkleInstanceProps = {
  color: string;
  size: number;
  style: React.CSSProperties;
};
const SparkleInstance = ({ color, size, style }: SparkleInstanceProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 160 160'
      fill='none'
      style={style}
      className='pointer-events-none absolute z-10 animate-spin'
    >
      <path
        fill={color}
        d='M80 0s2.285 44.788 19.496 62C116.707 79.211 160 80 160 80s-43.293-.211-60.504 17S80 160 80 160s-.289-45.789-17.5-63C45.288 79.789 0 80 0 80s45.288-.789 62.5-18C79.711 44.788 80 0 80 0z'
        className='animate-grow-and-shrink -z-10'
      />
    </svg>
  );
};

const defaultColor = 'oklch(60% 0.25 9)'; // hsl(335, 100%, 50%)
type Sparkle = ReturnType<typeof generateSparkle>;
const generateSparkle = (color = defaultColor) => {
  return {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    color,
    size: random(15, 30),
    style: {
      top: random(-150, 150) + '%',
      left: random(-50, 100) + '%',
      zIndex: random(-2, 2),
    },
  };
};
