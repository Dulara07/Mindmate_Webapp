import { initDatabase, dbAll } from './db/database';

async function inspect() {
  await initDatabase();

  const cats = dbAll<{ id: number; name: string }>('SELECT id, name FROM categories');
  const kwCount = dbAll<{ count: number }>('SELECT COUNT(*) as count FROM keywords');
  const respCount = dbAll<{ count: number }>('SELECT COUNT(*) as count FROM responses');

  console.log('categories:', cats.map(c => c.name));
  console.log('kwCount:', kwCount[0]?.count ?? 0);
  console.log('respCount:', respCount[0]?.count ?? 0);

  const sample = dbAll<{ keyword: string }>(`SELECT keyword FROM keywords LIMIT 10`);
  console.log('sample keywords:', sample.map(s => s.keyword));
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
