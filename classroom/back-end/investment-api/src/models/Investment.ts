import Database from '@/database/database.ts';

interface Investment {
  id: number;
  name: string;
  value: number;
}

interface InvestmentInput {
  name?: string;
  value?: number;
}

async function create({ name, value }: InvestmentInput): Promise<Investment> {
  const db = await Database.connect();

  if (name && value) {
    const sql = `
      INSERT INTO
        investments (name, value)
      VALUES
        (?, ?)
    `;

    const { lastID } = await db.run(sql, [name, value]);

    return await readById(lastID);
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
    const sql = `
      SELECT
          id, name, value
        FROM
          investments
        WHERE
          ${field} = ?
      `;

    const investments = await db.all(sql, [value]);

    return investments as unknown as Investment[];
  }

  const sql = `
    SELECT
      id, name, value
    FROM
      investments
  `;

  const investments = await db.all(sql);

  return investments as unknown as Investment[];
}

async function readById(id: number | string): Promise<Investment> {
  const db = await Database.connect();

  if (id) {
    const sql = `
      SELECT
          id, name, value
        FROM
          investments
        WHERE
          id = ?
      `;

    const investment = await db.get(sql, [id as number]);

    if (investment) {
      return investment as unknown as Investment;
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
  value,
}: InvestmentInput & { id?: number | string }): Promise<Investment> {
  const db = await Database.connect();

  if (name && value && id) {
    const sql = `
      UPDATE
        investments
      SET
        name = ?, value = ?
      WHERE
        id = ?
    `;

    const { changes } = await db.run(sql, [name, value, id as number]);

    if (changes === 1) {
      return readById(id);
    } else {
      throw new Error('Investment not found');
    }
  } else {
    throw new Error('Unable to update investment');
  }
}

async function remove(id: string | number): Promise<boolean> {
  const db = await Database.connect();

  if (id) {
    const sql = `
      DELETE FROM
        investments
      WHERE
        id = ?
    `;

    const { changes } = await db.run(sql, [id as number]);

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
