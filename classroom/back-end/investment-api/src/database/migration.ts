import Database from '@/database/database.ts';

async function up() {
  const db = await Database.connect();

  const categoriesSql = `
    CREATE TABLE categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL UNIQUE
    )
  `;

  const brokersSql = `
    CREATE TABLE brokers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    )
  `;

  const investmentsSql = `
    CREATE TABLE investments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      amount INTEGER NOT NULL,
      interest TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      categoryId TEXT NOT NULL,
      brokerId TEXT NOT NULL,
      FOREIGN KEY (categoryId) REFERENCES categories(id),
      FOREIGN KEY (brokerId) REFERENCES brokers(id)
    )
  `;

  await db.run(categoriesSql);
  await db.run(brokersSql);
  await db.run(investmentsSql);
}

export default { up };
