import { randomUUID } from 'node:crypto';
import Database from '@/database/database.ts';
import type { Category, CategoryInput } from '@/types/Category.d.ts';

async function create({ id, name, color }: CategoryInput): Promise<Category> {
  const db = await Database.connect();

  if (name && color) {
    const categoryId = id ?? randomUUID();

    const sql = `
      INSERT INTO
        categories (id, name, color)
      VALUES
        (?, ?, ?)
    `;

    await db.run(sql, [categoryId, name, color]);

    return await readById(categoryId);
  } else {
    throw new Error('Unable to create category');
  }
}

async function read(): Promise<Category[]> {
  const db = await Database.connect();

  const sql = `
    SELECT id, name, color FROM categories
  `;

  const categories = await db.all(sql);

  return categories as unknown as Category[];
}

async function readById(id: string): Promise<Category> {
  const db = await Database.connect();

  if (id) {
    const sql = `
      SELECT id, name, color FROM categories WHERE id = ?
    `;

    const category = await db.get(sql, [id]);

    if (category) {
      return category as unknown as Category;
    } else {
      throw new Error('Category not found');
    }
  } else {
    throw new Error('Unable to find category');
  }
}

async function update({
  id,
  name,
  color,
}: CategoryInput & { id?: string }): Promise<Category> {
  const db = await Database.connect();

  if (name && color && id) {
    const sql = `
      UPDATE categories SET name = ?, color = ? WHERE id = ?
    `;

    const { changes } = await db.run(sql, [name, color, id]);

    if (changes === 1) {
      return readById(id);
    } else {
      throw new Error('Category not found');
    }
  } else {
    throw new Error('Unable to update category');
  }
}

async function remove(id: string): Promise<boolean> {
  const db = await Database.connect();

  if (id) {
    const sql = `DELETE FROM categories WHERE id = ?`;

    const { changes } = await db.run(sql, [id]);

    if (changes === 1) {
      return true;
    } else {
      throw new Error('Category not found');
    }
  } else {
    throw new Error('Category not found');
  }
}

export default { create, read, readById, update, remove };
