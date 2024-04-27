import { PrismaClient } from '@prisma/client';
import { singleton } from '~/utils/singleton';

const db = singleton('db', () => new PrismaClient());

db.$connect();

export { db };
