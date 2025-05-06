import { contactFiltersSchema } from '@/contacts/contactSchemas';
import { ContactGroup, Prisma } from '@/db/generated/client';
import { z } from 'zod';

export class ContactQueryBuilder {
  private conditions: Prisma.ContactWhereInput[] = [];

  nameContains(name?: string) {
    if (name) {
      this.conditions.push({
        OR: [
          { name: { contains: name, mode: 'insensitive' } },
          { surname: { contains: name, mode: 'insensitive' } },
        ],
      });
    }
    return this;
  }

  emailContains(email?: string) {
    if (email) {
      this.conditions.push({ email: { contains: email, mode: 'insensitive' } });
    }
    return this;
  }

  phoneContains(phone?: string) {
    if (phone) {
      this.conditions.push({ phone: { contains: phone, mode: 'insensitive' } });
    }
    return this;
  }

  byGroup(group?: ContactGroup | null) {
    if (group) {
      this.conditions.push({ group });
    }
    return this;
  }

  hasPurchaseDate(hasPurchaseDate?: boolean) {
    if (hasPurchaseDate !== undefined) {
      if (hasPurchaseDate) {
        this.conditions.push({ purchaseDate: { not: null } });
      } else {
        this.conditions.push({ purchaseDate: null });
      }
    }
    return this;
  }

  purchaseDateBetween(startDate?: Date, endDate?: Date) {
    if (startDate && endDate) {
      this.conditions.push({
        purchaseDate: {
          gte: startDate,
          lte: endDate,
        },
      });
    } else if (startDate) {
      this.conditions.push({ purchaseDate: { gte: startDate } });
    } else if (endDate) {
      this.conditions.push({ purchaseDate: { lte: endDate } });
    }
    return this;
  }

  addFilter(filter?: ContactFilters) {
    if (filter) {
      this.nameContains(filter.name);
      this.emailContains(filter.email);
      this.phoneContains(filter.phone);
      this.byGroup(filter.group);
      this.hasPurchaseDate(filter.hasPurchaseDate);

      if (filter.purchaseDateStart || filter.purchaseDateEnd) {
        this.purchaseDateBetween(
          filter.purchaseDateStart,
          filter.purchaseDateEnd
        );
      }
    }
    return this;
  }

  build(): Prisma.ContactWhereInput {
    return {
      AND: this.conditions,
    };
  }
}

export type ContactFilters = z.infer<typeof contactFiltersSchema>;

export const parseContactFilters = (
  filters: ContactFilters
): ContactFilters => {
  const parsedFilters = contactFiltersSchema.parse(filters);
  return parsedFilters;
};
