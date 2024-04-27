let DATABASE_URL: string;

if (typeof import.meta.env.VITE_DATABASE_URL === 'string') {
  DATABASE_URL = import.meta.env.VITE_DATABASE_URL;
} else {
  throw new Error('Missing env');
}

export { DATABASE_URL };
