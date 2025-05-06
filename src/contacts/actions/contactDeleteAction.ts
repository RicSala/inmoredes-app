'use server';

import { revalidatePath } from 'next/cache';

import { contactDeleteInputSchema } from '../contactSchemas';
import { contactService } from '../contactService';
import { authedActionClient } from '@/actions/actionClient';

export const contactDeleteAction = authedActionClient
  .metadata({ actionName: 'contactDelete' })
  .schema(contactDeleteInputSchema)
  .action(async ({ parsedInput }) => {
    const service = contactService.deleteMany({ ids: [parsedInput.id] });
    revalidatePath('/app/contacts');
    return service;
  });
