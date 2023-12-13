import { useCallback, useEffect, useRef } from 'react';
import { random } from '../utils';
// inspired by:
// https://www.joshwcomeau.com/react/animated-sparkles-in-react/

const useRandomInterval = (
  callback: () => void,
  minDelay: number | null,
  maxDelay: number | null,
) => {
  const timeoutId = useRef<number | undefined>(undefined);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const isEnabled =
      typeof minDelay === 'number' && typeof maxDelay === 'number';

    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay!, maxDelay!); // we know these are numbers because of isEnabled
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };

      handleTick();
    }

    return () => window.clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);

  const cancel = useCallback(() => {
    window.clearTimeout(timeoutId.current);
  }, []);

  return cancel;
};

export default useRandomInterval;
