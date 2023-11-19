import NextImage, {
  ImageLoaderProps,
  ImageProps as NextImageProps,
} from 'next/image';

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

if (!workerUrl) {
  throw new Error(
    'NEXT_PUBLIC_WORKER_URL is not defined, did you forget to add it?',
  );
}

if (!cloudName) {
  throw new Error(
    'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined, did you forget to add it?',
  );
}

const normalizeSrc = (src: string) => (src[0] === '/' ? src.slice(1) : src);

// https://cloudinary.com/guides/front-end-development/integrating-cloudinary-with-next-js
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  const params = [
    'f_auto',
    'c_limit',
    'w_' + width,
    'q_' + (quality || 'auto'),
  ];

  const url = `${workerUrl}/cache/https://res.cloudinary.com/${cloudName}/image/fetch/${params.join(
    ',',
  )}/${normalizeSrc(src)}`;

  const isLocalFile = typeof src === 'string' && src.startsWith('/');
  const hasNoImage = typeof src === 'string' && src === '';

  if (isLocalFile) {
    return src;
  }

  if (hasNoImage) {
    return '@/public/fallback-image.webp';
  }

  return url;
}

type ImageProps = Omit<NextImageProps, 'loader'> & {
  useCloudinaryLoader?: boolean;
};

const Image = ({ useCloudinaryLoader = true, ...props }: ImageProps) => {
  return <NextImage loader={cloudinaryLoader} {...props} />;
};

export default Image;
