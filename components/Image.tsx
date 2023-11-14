'use client';

import { CldImage, CldImageProps } from 'next-cloudinary';

/*
 * A thin wrapper around next-cloudinary's CldImage component,
 * which sets the deliveryType to 'fetch' by default.
 *
 * Use this component instead of Next.js' Image component
 * since we don't have control of the image src.
 */
const Image = (props: CldImageProps) => {
  return <CldImage deliveryType='fetch' {...props} />;
};

export default Image;
