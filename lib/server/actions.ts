'use server';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { z } from 'zod';

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ApiResponseSchema = z.object({
  access_mode: z.enum(['public']),
  api_key: z.string(),
  asset_id: z.string(),
  bytes: z.number(),
  created_at: z.string(), // date ?
  etag: z.string(),
  folder: z.string(),
  format: z.string(),
  height: z.number(),
  original_filename: z.string(),
  placeholder: z.boolean(),
  public_id: z.string(),
  resource_type: z.enum(['image']),
  secure_url: z.string().url(),
  signature: z.string(),
  tags: z.array(z.string()),
  type: z.enum(['upload']),
  url: z.string().url(),
  version: z.number(),
  version_id: z.string(),
  width: z.number(),
});

async function fileToBuffer(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

async function uploadFile(buffer: Uint8Array) {
  console.log('uploading...');
  try {
    const res = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'crazy_auction' }, function (error, result) {
          if (error) {
            console.error(error);
            reject(error);
            return;
          }
          resolve(result);
        })
        .end(buffer);
    });

    return res;
  } catch (error) {
    console.error(error);
    return JSON.stringify(error);
  }
}

export async function uploadToCloudinary(formData: FormData) {
  const { timestamp, signature } = await getCloudinarySignature();

  const files = formData.getAll('image') as File[];
  if (!files) throw new Error('No files');

  const form = new FormData();

  form.append('file', files[0]);
  form.append('api_key', cloudinaryConfig.api_key!);
  form.append('signature', signature);
  form.append('timestamp', timestamp.toString());
  form.append('folder', 'crazy_auction');

  const endpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;

  const uploadPromises = files.map(async (file, index) => {
    console.log(`Uploading file ${index + 1} of ${files.length}`);
    const buffer = await fileToBuffer(file);

    try {
      const res = await uploadFile(buffer);
      const parsedRes = ApiResponseSchema.safeParse(res);

      if (!parsedRes.success) {
        console.error(parsedRes.error);
        return JSON.stringify(parsedRes.error);
      }

      return JSON.stringify(parsedRes.data.secure_url);
    } catch (error) {
      console.error(error);
      return JSON.stringify(error);
    }
  });

  const responses = await Promise.all(uploadPromises);
  return JSON.stringify(responses);
}

export async function getCloudinarySignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const params = {
    timestamp,
    folder: 'crazy_auction',
  };

  const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
  if (!CLOUDINARY_API_SECRET) throw new Error('No CLOUDINARY_API_SECRET');

  const signature = cloudinary.utils.api_sign_request(
    params,
    CLOUDINARY_API_SECRET,
  );

  console.log('timestamp ', timestamp);
  console.log('signature ', signature);

  return { timestamp, signature };
}
