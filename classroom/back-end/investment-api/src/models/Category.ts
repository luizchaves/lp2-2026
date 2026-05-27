import { prisma } from '@/database/prisma.ts';
import type { Category, CategoryInput } from '@/types/Category.d.ts';

async function create({ id, name, color }: CategoryInput): Promise<Category> {
  if (name && color) {
    return prisma.category.create({
      data: { ...(id ? { id } : {}), name, color },
    });
  } else {
    throw new Error('Unable to create category');
  }
}

async function read(): Promise<Category[]> {
  return prisma.category.findMany();
}

async function readById(id: string): Promise<Category> {
  const category = await prisma.category.findUnique({ where: { id } });
  if (category) {
    return category;
  }
  throw new Error('Category not found');
}

async function update({
  id,
  name,
  color,
}: CategoryInput & { id?: string }): Promise<Category> {
  if (id) {
    return prisma.category.update({
      where: { id },
      data: { name, color },
    });
  } else {
    throw new Error('Unable to update category');
  }
}

async function remove(id: string): Promise<boolean> {
  await prisma.category.delete({ where: { id } });
  return true;
}

export default { create, read, readById, update, remove };
