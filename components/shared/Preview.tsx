'use client';

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.bubble.css';

interface PreviewProps {
  value: string;
  className?: string;
}

const Preview = ({ value, className = '' }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );
  return (
    <ReactQuill
      className={cn('[&_.ql-editor]:px-0 [&_.ql-editor_ul]:pl-0', className)}
      theme='bubble'
      value={value}
      readOnly
    />
  );
};

export default Preview;
