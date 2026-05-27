import { prisma } from '@/database/prisma.ts';
import type { Broker, BrokerInput } from '@/types/Broker.d.ts';

async function create({ id, name }: BrokerInput): Promise<Broker> {
  if (name) {
    return prisma.broker.create({
      data: { ...(id ? { id } : {}), name },
    });
  } else {
    throw new Error('Unable to create broker');
  }
}

async function read(): Promise<Broker[]> {
  return prisma.broker.findMany();
}

async function readById(id: string): Promise<Broker> {
  const broker = await prisma.broker.findUnique({ where: { id } });
  if (broker) {
    return broker;
  }
  throw new Error('Broker not found');
}

async function update({
  id,
  name,
}: BrokerInput & { id?: string }): Promise<Broker> {
  if (id) {
    return prisma.broker.update({
      where: { id },
      data: { name },
    });
  } else {
    throw new Error('Unable to update broker');
  }
}

async function remove(id: string): Promise<boolean> {
  await prisma.broker.delete({ where: { id } });
  return true;
}

export default { create, read, readById, update, remove };
