import { generateComponents } from '@uploadthing/react';
import { generateReactHelpers } from '@uploadthing/react/hooks';

import type { fileRouter } from '@/app/api/uploadthing/core';

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<fileRouter>();

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<fileRouter>();
