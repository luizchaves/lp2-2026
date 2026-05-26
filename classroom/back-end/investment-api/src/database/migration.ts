import Database from '@/database/database.ts';

async function up() {
  const db = await Database.connect();

  const investmentsSql = `
    CREATE TABLE investments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL,
      value INTEGER NOT NULL
    )
  `;

  await db.run(investmentsSql);
}

export default { up };
