import { PageHeading } from '@/components/PageHeading';
import { ContactTable } from '@/contacts/components/ContactTable/ContactTable';
import { contactService } from '@/contacts/contactService';

export default async function Page() {
  const contacts = await contactService.findMany({ take: 25 });
  return (
    <div className='flex flex-col gap-4'>
      <PageHeading
        title='Dashboard'
        description='Principales métricas y acciones'
      />
      {/* @ts-expect-error - unknown metadata */}
      <ContactTable contacts={contacts} />
    </div>
  );
}
