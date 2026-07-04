import { prisma } from '@/database/prisma.ts';
import type { Investment, InvestmentInput } from '@/types/Investment.d.ts';

const include = {
  category: true,
  broker: true,
  user: { select: { id: true, name: true, email: true } },
};

async function create({
  name,
  amount,
  interest,
  dueDate,
  categoryId,
  brokerId,
  userId,
}: InvestmentInput): Promise<Investment> {
  if (
    name &&
    amount &&
    interest &&
    dueDate &&
    categoryId &&
    brokerId &&
    userId
  ) {
    return prisma.investment.create({
      data: {
        name,
        amount,
        interest,
        dueDate: new Date(dueDate),
        categoryId,
        brokerId,
        userId,
      },
      include,
    }) as Promise<Investment>;
  } else {
    throw new Error('Unable to create investment');
  }
}

async function read(
  field?: string,
  value?: string | number,
): Promise<Investment[]> {
  return prisma.investment.findMany({
    where: field && value ? { [field]: value } : undefined,
    include,
  }) as Promise<Investment[]>;
}

async function readById(id: string): Promise<Investment> {
  return prisma.investment.findUniqueOrThrow({
    where: { id },
    include,
  }) as Promise<Investment>;
}

async function update({
  id,
  name,
  amount,
  interest,
  dueDate,
  categoryId,
  brokerId,
  userId,
}: InvestmentInput & { id?: string }): Promise<Investment> {
  if (
    name &&
    amount &&
    interest &&
    dueDate &&
    categoryId &&
    brokerId &&
    userId &&
    id
  ) {
    return prisma.investment.update({
      where: { id },
      data: {
        name,
        amount,
        interest,
        dueDate: new Date(dueDate),
        categoryId,
        brokerId,
        userId,
      },
      include,
    }) as Promise<Investment>;
  } else {
    throw new Error('Unable to update investment');
  }
}

async function remove(id: string): Promise<boolean> {
  await prisma.investment.delete({ where: { id } });
  return true;
}

export default { create, read, readById, update, remove };
