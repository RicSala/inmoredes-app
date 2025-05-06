import { contactService } from '@/contacts/contactService';
import { ContactImportDialog } from '@/contacts/components/ContactImportDialog/ContactImportDialog';
import { ContactTable } from '@/contacts/components/ContactTable/ContactTable';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
export default async function Home() {
  const contacts = await contactService.findMany();
  return (
    <div className='flex flex-col gap-4'>
      <ContactImportDialog />
      <Link
        href='/app/contacts/new'
        className={buttonVariants({ variant: 'outline' })}
      >
        <PlusIcon className='h-4 w-4' />
        Add Contact
      </Link>
      <ContactTable contacts={contacts.data} />
    </div>
  );
}
