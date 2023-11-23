'use server';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { z } from 'zod';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}) as ConfigOptions;

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
  const res = await new Promise((resolve, reject) => {
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

  return res;
}

export async function uploadToCloudinary(formData: FormData) {
  const files = formData.getAll('image') as File[];
  if (!files) throw new Error('No files');

  const responses: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const buffer = await fileToBuffer(files[i]);

    const res = await uploadFile(buffer);

    const parsedRes = ApiResponseSchema.safeParse(res);

    if (!parsedRes.success) {
      console.error(parsedRes.error);
      responses.push('');
      continue;
    }

    responses.push(parsedRes.data.secure_url);
  }

  return responses;
}
