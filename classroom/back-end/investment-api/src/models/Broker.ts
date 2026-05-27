import { randomUUID } from 'node:crypto';
import Database from '@/database/database.ts';
import type { Broker, BrokerInput } from '@/types/Broker.d.ts';

async function create({ id, name }: BrokerInput): Promise<Broker> {
  const db = await Database.connect();

  if (name) {
    const brokerId = id ?? randomUUID();

    const sql = `
      INSERT INTO
        brokers (id, name)
      VALUES
        (?, ?)
    `;

    await db.run(sql, [brokerId, name]);

    return await readById(brokerId);
  } else {
    throw new Error('Unable to create broker');
  }
}

async function read(): Promise<Broker[]> {
  const db = await Database.connect();

  const sql = `SELECT id, name FROM brokers`;

  const brokers = await db.all(sql);

  return brokers as unknown as Broker[];
}

async function readById(id: string): Promise<Broker> {
  const db = await Database.connect();

  if (id) {
    const sql = `SELECT id, name FROM brokers WHERE id = ?`;

    const broker = await db.get(sql, [id]);

    if (broker) {
      return broker as unknown as Broker;
    } else {
      throw new Error('Broker not found');
    }
  } else {
    throw new Error('Unable to find broker');
  }
}

async function update({
  id,
  name,
}: BrokerInput & { id?: string }): Promise<Broker> {
  const db = await Database.connect();

  if (name && id) {
    const sql = `UPDATE brokers SET name = ? WHERE id = ?`;

    const { changes } = await db.run(sql, [name, id]);

    if (changes === 1) {
      return readById(id);
    } else {
      throw new Error('Broker not found');
    }
  } else {
    throw new Error('Unable to update broker');
  }
}

async function remove(id: string): Promise<boolean> {
  const db = await Database.connect();

  if (id) {
    const sql = `DELETE FROM brokers WHERE id = ?`;

    const { changes } = await db.run(sql, [id]);

    if (changes === 1) {
      return true;
    } else {
      throw new Error('Broker not found');
    }
  } else {
    throw new Error('Broker not found');
  }
}

export default { create, read, readById, update, remove };
