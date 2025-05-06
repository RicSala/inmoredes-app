'use server';

import { revalidatePath } from 'next/cache';

import { contactDeleteManyInputSchema } from '../contactSchemas';
import { contactService } from '../contactService';
import { authedActionClient } from '@/actions/actionClient';

export const contactDeleteManyAction = authedActionClient
  .metadata({ actionName: 'contactDeleteMany' })
  .schema(contactDeleteManyInputSchema)
  .action(async ({ parsedInput }) => {
    // const userId = ctx.session.user.id;
    const service = contactService.deleteMany({ ids: parsedInput.ids });
    revalidatePath('/app/contacts');
    return service;
  });
