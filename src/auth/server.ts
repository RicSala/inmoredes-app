import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from '@/db/prisma';

export const auth = betterAuth({
  user: {
    modelName: 'User',
  },
  basePath: '/api/auth',
  emailAndPassword: {
    enabled: true,
  },
  hooks: {},

  advanced: {
    database: {
      generateId: false,
    },
  },
  emailVerification: {},
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  plugins: [nextCookies()],
});

export { toNextJsHandler } from 'better-auth/next-js';
