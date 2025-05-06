import { ContactGroup } from '@/db/generated/client';
import { z } from 'zod';

export const contactCreateInputSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  birthday: z.date().optional().nullable(),
  purchaseDate: z.date().optional().nullable(),
  group: z.nativeEnum(ContactGroup).optional().default('GROUP_1'),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type TContactCreateInput = Omit<
  z.infer<typeof contactCreateInputSchema>,
  'metadata'
> & {
  metadata?: Record<string, unknown>;
};

export const contactUpdateParamsSchema = z.object({
  id: z.string().uuid(),
});

export const contactUpdateInputSchema = contactCreateInputSchema
  .partial()
  .merge(contactUpdateParamsSchema);

export type TContactUpdateInput = z.infer<typeof contactUpdateInputSchema>;

export const contactUpsertInputSchema = z.union([
  contactCreateInputSchema,
  contactUpdateInputSchema,
]);

export type TContactUpsertInput = z.infer<typeof contactUpsertInputSchema>;

export const contactDeleteInputSchema = z.object({
  id: z.string().uuid(),
});

export type TContactDeleteInput = z.infer<typeof contactDeleteInputSchema>;

export const contactDeleteManyInputSchema = z.object({
  ids: z.array(z.string().uuid()),
});

export type TContactDeleteManyInput = z.infer<
  typeof contactDeleteManyInputSchema
>;

export const contactFiltersSchema = z
  .object({
    name: z.string().optional().catch(undefined),
    email: z.string().optional().catch(undefined),
    phone: z.string().optional().catch(undefined),
    group: z.nativeEnum(ContactGroup).optional().catch(undefined),
    hasPurchaseDate: z.boolean().optional().catch(undefined),
    purchaseDateStart: z.date().optional().catch(undefined),
    purchaseDateEnd: z.date().optional().catch(undefined),
  })
  .strip()
  .optional();

export const contactFindManyInputSchema = z.object({
  skip: z.number().optional(),
  take: z.number().optional(),
  filters: contactFiltersSchema.optional(),
});
export type TContactFindManyInput = z.infer<typeof contactFindManyInputSchema>;

export const contactBulkImportSchema = z.object({
  contacts: z.array(contactCreateInputSchema),
  defaultGroup: z.nativeEnum(ContactGroup).optional().default('GROUP_1'),
});
export type TContactBulkImport = z.infer<typeof contactBulkImportSchema>;
