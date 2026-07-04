import Category from '@/models/Category.ts';
import Broker from '@/models/Broker.ts';
import Investment from '@/models/Investment.ts';
import User from '@/models/User.ts';
import { prisma } from '@/database/prisma.ts';
import seedersData from '@/database/seeders.json' with { type: 'json' };

await prisma.investment.deleteMany();
await prisma.broker.deleteMany();
await prisma.category.deleteMany();
await prisma.user.deleteMany();

for (const data of seedersData.users) {
  await User.create(data);
}

for (const data of seedersData.categories) {
  await Category.create(data);
}

for (const data of seedersData.brokers) {
  await Broker.create(data);
}

for (const data of seedersData.investments) {
  await Investment.create(data);
}
