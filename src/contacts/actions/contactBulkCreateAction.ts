'use server';

import { revalidatePath } from 'next/cache';

import { contactBulkImportSchema } from '../contactSchemas';
import { contactService } from '../contactService';
import { authedActionClient } from '@/actions/actionClient';

export const contactBulkCreateAction = authedActionClient
  .metadata({ actionName: 'contactBulkCreate' })
  .schema(contactBulkImportSchema)
  .action(async ({ parsedInput }) => {
    await contactService.deleteAll();

    const service = contactService.bulkCreate({
      contacts: parsedInput.contacts,
      defaultGroup: parsedInput.defaultGroup,
    });
    revalidatePath('/app/contacts');
    return service;
  });
