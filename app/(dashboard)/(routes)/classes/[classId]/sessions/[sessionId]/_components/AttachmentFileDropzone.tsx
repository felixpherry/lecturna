'use client';

import { Group, Input, Text, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { FileType } from './AttachmentForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { convertToBase64, isBase64DataURL } from '@/lib/utils';
import { useState } from 'react';
import { X } from 'lucide-react';

const mappedMimeTypes = {
  image: ['image/*'],
  pdf: ['application/pdf'],
  text: ['text/*'],
  video: ['video/*'],
  audio: ['audio/*'],
};

interface AttachmentFileDropzoneProps {
  type: FileType;
  setIsEditingFile: (isEditingFile: boolean) => void;
  onFileChange: (value: string) => void;
  setFiles: (files: File[]) => void;
  value: string;
}

const AttachmentFileDropzone = ({
  type,
  setIsEditingFile,
  onFileChange,
  setFiles,
  value,
}: AttachmentFileDropzoneProps) => {
  const [fileUrl, setFileUrl] = useState(!isBase64DataURL(value) ? value : '');
  const handleUploadFile = async (files: File[]) => {
    if (!files[0]) return;

    try {
      const base64Url = (await convertToBase64(files[0])) as string;
      onFileChange(base64Url);

      setFiles([files[0]]);
      setIsEditingFile(false);
    } catch (error: any) {
      toast.error(`Failed to parse file: ${error.message}`);
    }
  };

  const handleRejectFile = () => {
    toast.error('File size exceeds limit allowed');
  };

  const handleUploadLink = () => {
    setIsEditingFile(false);
    setFiles([]);
    onFileChange(fileUrl);
  };

  return (
    <div className='p-3 rounded-md border flex flex-col justify-center'>
      {value !== '' && (
        <div className='ml-auto'>
          <X
            onClick={() => setIsEditingFile(false)}
            className='text-muted-foreground hover:text-primary h-6 w-6 cursor-pointer'
          />
        </div>
      )}

      <Dropzone
        onDrop={handleUploadFile}
        onReject={handleRejectFile}
        maxSize={1024 ** 2}
        accept={mappedMimeTypes[type]}
        multiple={false}
      >
        <Group
          justify='center'
          gap='xl'
          mih={220}
          style={{ pointerEvents: 'none' }}
        >
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
            <Text size='xl' inline>
              Drag file here or click to select file
            </Text>
            <Text size='sm' c='dimmed' inline mt={7}>
              File should not exceed 1mb
            </Text>
          </div>
        </Group>
      </Dropzone>
      <div className='flex flex-col gap-3'>
        <div className='items-center flex w-full px-10'>
          <div className='flex-1 border-t border-[rgb(232,234,237)]' />
          <div className='mx-5 text-muted-foreground text-base'>OR</div>
          <div className='flex-1 border-t border-[rgb(232,234,237)]' />
        </div>
        <div className='px-10 pb-5 flex gap-3'>
          <Input
            className='[&_input]:rounded-full [&_input]:h-10 [&_input]:px-6 w-4/5'
            placeholder='Paste file link'
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
          />
          <Button
            onClick={handleUploadLink}
            type='button'
            variant='primary-blue'
            size='sm'
            className='w-1/5 rounded-full h-10'
            disabled={!fileUrl.length}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttachmentFileDropzone;
