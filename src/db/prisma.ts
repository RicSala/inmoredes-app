/* eslint-disable */
import { PrismaClient } from './generated/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;

// TODO: when it's stable, use the neon serverless adapter - Apparently will be way faster
