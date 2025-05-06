'use client';

import { ContactForm } from '@/contacts/components/ContactForm';
import { TContactCreateInput } from '@/contacts/contactSchemas';
type ContactDetailPageClientProps = {
  contact: TContactCreateInput;
};
export function ContactDetailPageClient({
  contact,
}: ContactDetailPageClientProps) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='container mx-auto py-10'>
        <ContactForm contact={contact} />
      </div>
    </div>
  );
}
