'use server';

import { revalidatePath } from 'next/cache';

import { contactUpsertInputSchema } from '../contactSchemas';
import { contactService } from '../contactService';
import { authedActionClient } from '@/actions/actionClient';
import { createLogger } from '@/logging/Logger';

export const contactUpsertAction = authedActionClient
  .metadata({ actionName: 'contactUpsert' })
  .schema(contactUpsertInputSchema)
  .action(async ({ parsedInput }) => {
    logger.info('parsedInput', parsedInput);
    // const userId = ctx.session.user.id;
    const service = contactService.upsert(parsedInput);
    revalidatePath('/app/contacts');
    return service;
  });

const logger = createLogger('contactUpsertAction');
