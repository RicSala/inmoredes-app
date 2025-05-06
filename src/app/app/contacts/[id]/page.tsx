import { ContactDetailPageClient } from '@/app/app/contacts/[id]/ContactDetailPageClient';
import { PageHeading } from '@/components/PageHeading';
import { contactService } from '@/contacts/contactService';

import { notFound } from 'next/navigation';

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contact =
    id !== 'new' ? await contactService.getContactById(id) : undefined;

  if (contact === null) notFound();

  return (
    <div className='flex flex-col gap-4'>
      <PageHeading title='Contact' description='Contact details' />
      <div className='container mx-auto py-10'>
        {/* @ts-expect-error - unknown metadata  */}
        <ContactDetailPageClient contact={contact} />
      </div>
    </div>
  );
}
