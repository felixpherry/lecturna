'use client';

import { Group, Text, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { toast } from 'sonner';
import { convertToBase64, isBase64DataURL } from '@/lib/utils';
import { useState } from 'react';
import { X } from 'lucide-react';

interface LogoImageDropzoneProps {
  onFileChange: (value: string) => void;
  setFiles: (files: File[]) => void;
  value: string;
  handleResetImage: () => void;
}

const LogoImageDropzone = ({
  onFileChange,
  setFiles,
  value,
  handleResetImage,
}: LogoImageDropzoneProps) => {
  const [fileUrl, setFileUrl] = useState(!isBase64DataURL(value) ? value : '');
  const handleUploadFile = async (files: File[]) => {
    if (!files[0]) return;

    try {
      const base64Url = (await convertToBase64(files[0])) as string;
      onFileChange(base64Url);

      setFiles([files[0]]);
    } catch (error: any) {
      toast.error(`Failed to parse file: ${error.message}`);
    }
  };

  const handleRejectFile = () => {
    toast.error('File size exceeds limit allowed');
  };

  return (
    <div className='p-3 rounded-md border flex flex-col justify-center'>
      <div className='ml-auto'>
        <X
          onClick={handleResetImage}
          className='h-4 w-4 cursor-pointer'
        />
      </div>
      <Dropzone
        onDrop={handleUploadFile}
        onReject={handleRejectFile}
        maxSize={1024 ** 2}
        accept={['image/*']}
        multiple={false}>
        <Group
          justify='center'
          gap='xl'
          mih={220}
          style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-blue-6)',
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-red-6)',
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{
                width: rem(52),
                height: rem(52),
                color: 'var(--mantine-color-dimmed)',
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text
              size='xl'
              inline>
              Drag image here or click to select file
            </Text>
            <Text
              size='sm'
              c='dimmed'
              inline
              mt={7}>
              Image should not exceed 1mb
            </Text>
          </div>
        </Group>
      </Dropzone>
    </div>
  );
};

export default LogoImageDropzone;
