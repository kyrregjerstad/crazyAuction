import Skeleton, {
  SkeletonTheme,
  type SkeletonProps,
} from 'react-loading-skeleton';

import './skeleton.css';

type ExtendedSkeletonProps = SkeletonProps & {
  animationDelay?: string;
};

const SkeletonComponent = ({
  animationDelay = '0s',
  ...props
}: ExtendedSkeletonProps) => {
  const inlineStyle = {
    '--animation-delay': animationDelay,
  } as React.CSSProperties;

  return (
    <SkeletonTheme baseColor='#111827' highlightColor='#171e2e'>
      <Skeleton className={props.className} style={inlineStyle} />
    </SkeletonTheme>
  );
};

export default SkeletonComponent;
