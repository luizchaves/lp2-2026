import { randomUUID } from 'node:crypto';
import Database from '@/database/database.ts';
import type { Investment, InvestmentInput } from '@/types/Investment.d.ts';

function mapRow(row: Record<string, unknown>): Investment {
  return {
    id: row.id as string,
    name: row.name as string,
    amount: row.amount as number,
    interest: row.interest as string,
    createdAt: row.createdAt as string,
    categoryId: row.categoryId as string,
    brokerId: row.brokerId as string,
    category: {
      id: row.category_id as string,
      name: row.category_name as string,
      color: row.category_color as string,
    },
    broker: {
      id: row.broker_id as string,
      name: row.broker_name as string,
    },
  };
}

const joinSQL = `
  SELECT
    i.id, i.name, i.amount, i.interest, i.createdAt, i.categoryId, i.brokerId,
    c.id AS category_id, c.name AS category_name, c.color AS category_color,
    b.id AS broker_id, b.name AS broker_name
  FROM investments i
  JOIN categories c ON i.categoryId = c.id
  JOIN brokers b ON i.brokerId = b.id
`;

async function create({
  name,
  amount,
  interest,
  categoryId,
  brokerId,
}: InvestmentInput): Promise<Investment> {
  const db = await Database.connect();

  if (name && amount && interest && categoryId && brokerId) {
    const id = randomUUID();

    const sql = `
      INSERT INTO
        investments (id, name, amount, interest, categoryId, brokerId)
      VALUES
        (?, ?, ?, ?, ?, ?)
    `;

    await db.run(sql, [id, name, amount, interest, categoryId, brokerId]);

    return await readById(id);
  } else {
    throw new Error('Unable to create investment');
  }
}

async function read(
  field?: string,
  value?: string | number,
): Promise<Investment[]> {
  const db = await Database.connect();

  if (field && value) {
    const rows = await db.all(`${joinSQL} WHERE i.${field} = ?`, [value]);
    return (rows as Record<string, unknown>[]).map(mapRow);
  }

  const rows = await db.all(joinSQL);
  return (rows as Record<string, unknown>[]).map(mapRow);
}

async function readById(id: string): Promise<Investment> {
  const db = await Database.connect();

  if (id) {
    const row = await db.get(`${joinSQL} WHERE i.id = ?`, [id]);

    if (row) {
      return mapRow(row as Record<string, unknown>);
    } else {
      throw new Error('Investment not found');
    }
  } else {
    throw new Error('Unable to find investment');
  }
}

async function update({
  id,
  name,
  amount,
  interest,
  categoryId,
  brokerId,
}: InvestmentInput & { id?: string }): Promise<Investment> {
  const db = await Database.connect();

  if (name && amount && interest && categoryId && brokerId && id) {
    const sql = `
      UPDATE
        investments
      SET
        name = ?, amount = ?, interest = ?, categoryId = ?, brokerId = ?
      WHERE
        id = ?
    `;

    const { changes } = await db.run(sql, [
      name,
      amount,
      interest,
      categoryId,
      brokerId,
      id,
    ]);

    if (changes === 1) {
      return readById(id);
    } else {
      throw new Error('Investment not found');
    }
  } else {
    throw new Error('Unable to update investment');
  }
}

async function remove(id: string): Promise<boolean> {
  const db = await Database.connect();

  if (id) {
    const sql = `
      DELETE FROM
        investments
      WHERE
        id = ?
    `;

    const { changes } = await db.run(sql, [id]);

    if (changes === 1) {
      return true;
    } else {
      throw new Error('Investment not found');
    }
  } else {
    throw new Error('Investment not found');
  }
}

export default { create, read, readById, update, remove };
