import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isBase64DataURL = (value: string) => {
  const base64Regex = /^data:[a-z]+\/[a-z]+;base64,/;
  return base64Regex.test(value);
};

export const convertToTitleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getRandElement = (arr: any[]) => {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
};

export const convertToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader?.result;
      resolve(base64String);
    };

    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};
