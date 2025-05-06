'use client';

import { Accept, useDropzone } from 'react-dropzone';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type DropzoneProps = {
  accept?: Accept;
  onDrop?: (files: File[]) => void;
  className?: string;
  children?: React.ReactNode;
  maxFiles?: number;
  dragActiveElement?: ReactNode;
  dragInactiveElement?: ReactNode;
  value?: string;
};
export function Dropzone({
  onDrop = () => {},
  className,
  accept,
  children,
  maxFiles = 1,
  dragActiveElement: propDragActiveElement,
  dragInactiveElement: propDragInactiveElement,
  value,
  ...rest
}: DropzoneProps) {
  const { getRootProps, getInputProps, acceptedFiles, isDragActive } =
    useDropzone({
      maxFiles,
      accept,
      onDrop: () => {},
      onDropAccepted: (files) => {
        onDrop(files);
      },
      onDropRejected: (_files) => {},
    });

  const dragActiveElement = propDragActiveElement || (
    <p className='text-center'>Drop your file here</p>
  );

  const dragInactiveElement = propDragInactiveElement || (
    <p className='flex !flex-1 flex-col items-center gap-2 text-center'>
      Drag or click to select a file
    </p>
  );

  const hasFilesElement = dragInactiveElement;

  return (
    <div
      {...getRootProps({})}
      className={cn(
        `border-primary/20 rounded border border-dashed !py-0`,
        className
      )}
      {...rest}
    >
      <Input type='file' {...getInputProps()} />
      {acceptedFiles.length > 0 || value
        ? hasFilesElement
        : isDragActive
          ? dragActiveElement
          : dragInactiveElement}
      {children}
    </div>
  );
}
