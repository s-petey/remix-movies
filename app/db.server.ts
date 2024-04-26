import { PrismaClient } from '@prisma/client';
import { PRISMA_DATABASE_URL } from './server/url';
import { singleton } from '~/utils/singleton';

const db = singleton(
  'db',
  () =>
    new PrismaClient({
      datasourceUrl: PRISMA_DATABASE_URL,
    }),
);

db.$connect();

export { db };
