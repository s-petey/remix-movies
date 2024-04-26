// eslint-disable-next-line import/no-unresolved
import { Database } from 'bun:sqlite';

async function makeTables() {
  const { pathname } = Bun.pathToFileURL(`${__dirname}/../../${Bun.env.DATABASE_URL}`);
  const db = new Database(pathname);

  try {
    const query = db.query('SELECT COUNT(*) as count FROM Movies;');
    const { count } = query.get() as { count: number };
    console.log('count: ', count);
    if (typeof count === 'number' && count > 0) {
      throw new Error('data exists');
    }
    const file = Bun.file(__dirname + '/seed.sql');
    const sql = await file.text();

    console.time('Inserted Data Tables');
    await db.run(sql);
    console.timeEnd('Inserted Data Tables');
  } catch (error) {
    console.error(error);
    console.log('There is already data seeded!');
  }
}

makeTables().catch((e) => {
  console.error(e);
  process.exit(1);
});
