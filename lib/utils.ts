import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function wait(ms: number, shouldReject = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(new Error('Something went wrong'));
      } else {
        resolve(true);
      }
    }, ms);
  });
}

export function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function convertFilesToBase64(files: File[]): Promise<string[]> {
  return Promise.all(files.map((file) => toBase64(file)));
}

// prefers numbers closer to min and max
export const random = (min: number, max: number): number => {
  const rand1 = Math.floor(Math.random() * (max - min + 1) + min);
  const rand2 = Math.floor(Math.random() * (max - min + 1) + min);
  return Math.abs(rand1 - min) < Math.abs(rand2 - max) ? rand1 : rand2;
};
