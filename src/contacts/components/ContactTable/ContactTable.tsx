import { Contact } from '@/contacts/components/ContactTable/contactTableColumns';

import { DataTable } from '@/components/Table/Table';
import { contactTableColumns } from '@/contacts/components/ContactTable/contactTableColumns';

type ContactTableProps = {
  contacts: Contact[];
};
export function ContactTable({ contacts }: ContactTableProps) {
  return (
    <>
      <DataTable
        columns={contactTableColumns}
        data={contacts}
        resourceBasePath='/app/contacts'
      />
    </>
  );
}
