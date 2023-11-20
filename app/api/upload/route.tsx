import authOptions from '@/app/auth/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

const MAX_SIZE = 1024 * 1024 * 10; // 10MB

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;

cloudinary.v2.config({
  secure: true,
});

const options = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
};

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!cloudName || !apiKey) {
    return NextResponse.json(
      { error: 'Missing Cloudinary config' },
      { status: 500 },
    );
  }

  const result = await cloudinary.v2.uploader.upload(
    'https://www.kyrre.dev/images/profile-img.webp',
    options,
  );

  console.log(result);

  return NextResponse.json({ secure_url: result.secure_url }, { status: 200 });
}
