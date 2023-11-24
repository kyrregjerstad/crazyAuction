import NewAuctionForm from '@/components/NewAuctionForm';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}) as ConfigOptions;

export default function NewAuctionPage() {
  async function create(formData: FormData) {
    'use server';
    const file = formData.get('image') as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'crazy_auction' }, function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        })
        .end(buffer);
    });
  }

  return (
    <>
      <div className='flex w-full max-w-6xl flex-col items-center justify-center'>
        <h1 className='my-8 text-2xl font-bold md:text-4xl lg:text-5xl'>
          Create a New Auction
        </h1>

        <NewAuctionForm />
      </div>
    </>
  );
}
