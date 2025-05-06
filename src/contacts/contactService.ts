import { db } from '@/db/prisma';
import { Contact, ContactGroup, Prisma } from '@/db/generated/client';
import {
  TContactUpsertInput,
  TContactFindManyInput,
  TContactDeleteManyInput,
  TContactCreateInput,
} from '@/contacts/contactSchemas';
import { ContactQueryBuilder } from '@/contacts/queryBuilder';

export const contactService = {
  upsert: async (contact: TContactUpsertInput): Promise<Contact> => {
    if ('id' in contact) {
      return await db.contact.update({
        where: { id: contact.id },
        data: contact,
      });
    }
    return await db.contact.create({
      data: contact,
    });
  },

  bulkCreate: async ({
    contacts,
    defaultGroup,
  }: {
    contacts: TContactCreateInput[];
    defaultGroup: ContactGroup;
  }) => {
    return await db.contact.createMany({
      data: contacts.map((contact) => ({
        ...contact,
        group: contact.group || defaultGroup,
      })),
      skipDuplicates: true,
    });
  },

  findMany: async (
    input: TContactFindManyInput = {}
  ): Promise<{
    data: Contact[];
    count: number;
  }> => {
    const { skip = 0, take = undefined, filters } = input;

    const queryBuilder = new ContactQueryBuilder();
    queryBuilder.addFilter(filters);
    const where = queryBuilder.build();

    const [data, count] = await Promise.all([
      db.contact.findMany({
        where,
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
      }),
      db.contact.count({
        where,
      }),
    ]);

    return { data, count };
  },

  deleteMany: async (
    input: TContactDeleteManyInput
  ): Promise<{ count: number }> => {
    return await db.contact.deleteMany({
      where: { id: { in: input.ids } },
    });
  },

  deleteAll: async (): Promise<{ count: number }> => {
    return await db.contact.deleteMany();
  },

  getContactById: async (id: string): Promise<Contact | null> => {
    return await db.contact.findUnique({
      where: { id },
    });
  },

  getContactByEmail: async (email: string): Promise<Contact | null> => {
    return await db.contact.findUnique({
      where: { email },
    });
  },

  getContactByPhone: async (phone: string): Promise<Contact | null> => {
    return await db.contact.findUnique({
      where: { phone },
    });
  },

  getContactsByGroup: async (group: string): Promise<Contact[]> => {
    return await db.contact.findMany({
      where: { group: group as Prisma.EnumContactGroupFilter },
    });
  },

  getTodaysBirthdays: async (): Promise<Contact[]> => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    return await db.$queryRaw`
      SELECT * FROM "Contact"
      WHERE EXTRACT(MONTH FROM "birthday") = ${month}
      AND EXTRACT(DAY FROM "birthday") = ${day}
    `;
  },

  getTodaysPurchaseAnniversaries: async (): Promise<Contact[]> => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // Using raw SQL for date part extraction
    return await db.$queryRaw`
      SELECT * FROM "Contact"
      WHERE EXTRACT(MONTH FROM "purchaseDate") = ${month}
      AND EXTRACT(DAY FROM "purchaseDate") = ${day}
    `;
  },
};
