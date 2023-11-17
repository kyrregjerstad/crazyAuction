import NextImage, {
  ImageLoaderProps,
  ImageProps as NextImageProps,
} from 'next/image';

const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL;

if (!workerUrl) {
  throw new Error(
    'NEXT_PUBLIC_WORKER_URL is not defined, did you forget to add it?',
  );
}

const normalizeSrc = (src: string) => (src[0] === '/' ? src.slice(1) : src);

export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  const params = [
    'f_auto',
    'c_limit',
    'w_' + width,
    'q_' + (quality || 'auto'),
  ];
  return `${workerUrl}/cache/https://res.cloudinary.com/${
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }/image/fetch/${params.join(',')}/${normalizeSrc(src)}`;
}

type ImageProps = Omit<NextImageProps, 'loader'>;

const Image = (props: ImageProps) => (
  <NextImage loader={cloudinaryLoader} {...props} />
);

export default Image;
