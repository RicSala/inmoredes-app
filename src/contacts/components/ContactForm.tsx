'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Loader2, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { ContactGroup } from '@/db/generated/client';
import {
  contactCreateInputSchema,
  TContactCreateInput,
} from '@/contacts/contactSchemas';
import { contactUpsertAction } from '@/contacts/actions/contactUpsertAction';
import { contactDeleteAction } from '@/contacts/actions/contactDeleteAction';
import { createLogger } from '@/logging/Logger';

// Props for the ContactForm component
type ContactFormProps = {
  contact?: TContactCreateInput;
  onDeleteContact?: (id: string) => Promise<void>;
};

export function ContactForm({ contact, onDeleteContact }: ContactFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize form with default values or existing contact data
  const form = useForm({
    resolver: zodResolver(contactCreateInputSchema),
    defaultValues: contact
      ? {
          ...contact,
          metadata: contact.metadata ? contact.metadata : undefined,
        }
      : {
          name: '',
          surname: '',
          email: '',
          phone: '',
          birthday: null,
          purchaseDate: null,
          group: ContactGroup.GROUP_1,
          metadata: undefined,
        },
  });

  // Handle form submission
  const onSubmit = async (data: TContactCreateInput) => {
    try {
      setIsSubmitting(true);
      await contactUpsertAction({
        ...data,
        id: contact?.id,
      });
      router.refresh();
      // Optionally redirect or show success message
    } catch (error) {
      logger.error('Error saving contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle contact deletion
  const handleDelete = async () => {
    if (!contact?.id || !onDeleteContact) return;

    try {
      setIsDeleting(true);
      await onDeleteContact(contact.id);
      router.refresh();
      router.push('/contacts'); // Adjust this path as needed
    } catch (error) {
      logger.error('Error deleting contact:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>
          {contact?.id ? 'Edit Contact' : 'New Contact'}
        </h2>
        {contact?.id && onDeleteContact && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' size='sm'>
                {isDeleting ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Trash2 className='mr-2 h-4 w-4' />
                )}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  contact and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  {isDeleting ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Name and Surname */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='surname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input placeholder='Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email and Phone */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='john.doe@example.com'
                      type='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder='+1 (555) 123-4567' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Birthday and Purchase Date */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='birthday'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Birthday</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='purchaseDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Purchase Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Group */}
          <FormField
            control={form.control}
            name='group'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Group</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a group' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ContactGroup.GROUP_1}>
                      Grupo 1
                    </SelectItem>
                    <SelectItem value={ContactGroup.GROUP_2}>
                      Grupo 2
                    </SelectItem>
                    <SelectItem value={ContactGroup.GROUP_3}>
                      Grupo 3
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='button'
            variant='outline'
            className='w-full'
            onClick={() => {
              router.push('/app/contacts');
            }}
          >
            <X className='mr-2 h-4 w-4' />
            Cancel
          </Button>
          <Button
            type='button'
            variant='outline'
            className='w-full'
            onClick={() => {
              if (!contact?.id) return;
              contactDeleteAction({ id: contact.id });
              router.push('/app/contacts');
            }}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </Button>

          {/* Submit Button */}
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              <>Save Contact</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

const logger = createLogger('ContactForm');
