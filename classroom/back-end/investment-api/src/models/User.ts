import { prisma } from '@/database/prisma.ts';
import { hashPassword } from '@/utils/password.ts';
import type { User, UserInput } from '@/types/User.d.ts';

const select = { id: true, name: true, email: true };

async function create({ id, name, email, password }: UserInput): Promise<User> {
  if (name && email && password) {
    return prisma.user.create({
      data: { ...(id ? { id } : {}), name, email, password: hashPassword(password) },
      select,
    });
  } else {
    throw new Error('Unable to create user');
  }
}

async function read(): Promise<User[]> {
  return prisma.user.findMany({ select });
}

async function readById(id: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id }, select });
  if (user) {
    return user;
  }
  throw new Error('User not found');
}

async function update({
  id,
  name,
  email,
  password,
}: UserInput & { id?: string }): Promise<User> {
  if (id) {
    return prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        ...(password ? { password: hashPassword(password) } : {}),
      },
      select,
    });
  } else {
    throw new Error('Unable to update user');
  }
}

async function remove(id: string): Promise<boolean> {
  await prisma.user.delete({ where: { id } });
  return true;
}

export default { create, read, readById, update, remove };
