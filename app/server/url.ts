let DATABASE_URL: string;
let PRISMA_DATABASE_URL: string;

console.log('import.meta.env: ', import.meta.env);

if (typeof import.meta.env.VITE_DATABASE_URL === 'string') {
  DATABASE_URL = import.meta.env.VITE_DATABASE_URL;
  PRISMA_DATABASE_URL = `file:../${DATABASE_URL}`;
} else {
  throw new Error('Missing env');
}

export { DATABASE_URL, PRISMA_DATABASE_URL };
