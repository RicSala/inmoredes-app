'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  Upload,
  CheckCircle2,
  Loader2,
  UploadIcon,
  DownloadIcon,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useContactImport } from '@/contacts/hooks/useContactImport';
import { Dropzone } from '@/components/Dropzone/Dropzone';
import { ContactGroup } from '@/db/generated/client';
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import { validFormats } from '@/contacts/components/ContactImportDialog/validFormats';

type ImportStep = 'upload' | 'confirm' | 'processing' | 'complete';

export function ContactImportDialog() {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [contactGroup, setContactGroup] = useState<ContactGroup>('GROUP_1');
  const [state, { loadFile, parseFile, reset }] = useContactImport({
    onColumnsDetected: (_columns) => {
      setCurrentStep('confirm');
    },
    onComplete: async (_data) => {
      setCurrentStep('complete');
    },
  });
  const [open, setOpen] = useState(false);

  const handleDrop = (files: File[]) => {
    if (!Object.keys(validFormats).includes(files[0].type)) {
      alert('Please upload a CSV or Excel file');
      return;
    }

    loadFile(files[0]);
  };
  const processFile = () => {
    parseFile(contactGroup);
    setCurrentStep('processing');
  };

  const resetDialog = () => {
    setCurrentStep('upload');
    reset();
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(resetDialog, 300);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className='py-10'>
            <Dropzone
              onDrop={handleDrop}
              accept={validFormats}
              className='p-8 !py-8'
            >
              <div className='flex flex-col items-center justify-center gap-4'>
                <p className='text-muted-foreground text-center text-sm'>
                  Drop a CSV or Excel file here or click to upload
                </p>
                <UploadIcon className='text-muted-foreground h-12 w-12' />
                <p className='text-muted-foreground text-center text-sm'>
                  {state.file?.name}
                </p>
              </div>
            </Dropzone>
            <div className='flex flex-col items-center justify-center gap-4'>
              <p className='text-muted-foreground text-center text-sm'>
                Select the group for the imported contacts
              </p>
              <Select
                value={contactGroup}
                onValueChange={(value) =>
                  setContactGroup(value as ContactGroup)
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a group' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ContactGroup).map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'confirm':
        return (
          <div className='py-6'>
            <h3 className='mb-4 text-lg font-medium'>
              The following columns were detected
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.columns.map((column) => (
                  <TableRow key={column.name} className='hover:bg-none'>
                    <TableCell className='font-medium'>
                      {column.name}
                      {column.required && (
                        <span className='text-destructive ml-1'>*</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {column.matched ? (
                        <span className='flex items-center text-green-600'>
                          <CheckCircle2 className='mr-1 h-4 w-4' />
                          Matched
                        </span>
                      ) : (
                        <span className='flex items-center text-amber-600'>
                          <AlertCircle className='mr-1 h-4 w-4' />
                          Not found {column.known ? '' : ' (unknown)'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {state.columns.some((col) => col.required && !col.matched) && (
              <Alert variant='destructive' className='mt-4'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Missing required columns</AlertTitle>
                <AlertDescription>
                  Some required columns are missing. Please check your file and
                  try again.
                </AlertDescription>
              </Alert>
            )}
            <DialogFooter className='mt-6'>
              <Button variant='outline' onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={processFile}
                disabled={state.columns.some(
                  (col) => col.required && !col.matched
                )}
              >
                Import Contacts
              </Button>
            </DialogFooter>
          </div>
        );

      case 'processing':
        return (
          <div className='py-12 text-center'>
            <div className='relative mx-auto mb-6 h-24 w-24'>
              <Loader2 className='text-primary/30 h-24 w-24 animate-spin' />
              <Loader2
                className='text-primary absolute top-0 left-0 h-24 w-24 animate-spin'
                style={{ animationDuration: '3s' }}
              />
            </div>
            <h3 className='mb-2 text-lg font-medium'>Processing file</h3>
            <p className='text-muted-foreground mb-6 text-sm'>
              Please wait while we process your contacts
            </p>
            <Progress value={65} className='mx-auto max-w-md' />
          </div>
        );

      case 'complete':
        return (
          <div className='py-8 text-center'>
            <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 p-4 dark:bg-green-950/20'>
              <CheckCircle2 className='h-12 w-12 text-green-600 dark:text-green-500' />
            </div>
            <h3 className='mb-6 text-lg font-medium'>Import Complete</h3>

            <div className='mx-auto mb-8 grid max-w-md grid-cols-3 gap-4'>
              <div className='bg-muted/30 rounded-lg p-4'>
                <div className='text-2xl font-bold'>
                  {state.results.metadata.total}
                </div>
                <div className='text-muted-foreground text-sm'>Total</div>
              </div>
              <div className='rounded-lg bg-green-50 p-4 dark:bg-green-950/20'>
                <div className='text-2xl font-bold text-green-600 dark:text-green-500'>
                  {state.results.metadata.processed}
                </div>
                <div className='text-muted-foreground text-sm'>Imported</div>
              </div>
              <div className='flex flex-col gap-2 rounded-lg bg-red-50 p-4 dark:bg-red-950/20'>
                <div className='text-2xl font-bold text-red-600 dark:text-red-500'>
                  {state.results.metadata.errors}
                </div>
                <div className='text-muted-foreground text-sm'>Errors</div>
                {/* download errors */}
                {state.results.invalidContacts.length > 0 && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const blob = new Blob(
                        [
                          JSON.stringify(
                            state.results.invalidContacts,
                            null,
                            2
                          ),
                        ],
                        { type: 'application/json' }
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `errors-${state.file?.name}.json`;
                      a.click();
                    }}
                  >
                    <DownloadIcon className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>

            <Button onClick={handleClose}>Done</Button>
          </div>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        setCurrentStep('upload');
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Upload className='mr-2 h-4 w-4' />
          Import Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md md:max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'upload' && 'Import Contacts'}
            {currentStep === 'confirm' && 'Confirm Columns'}
            {currentStep === 'processing' && 'Processing Import'}
            {currentStep === 'complete' && 'Import Complete'}
          </DialogTitle>
        </DialogHeader>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
