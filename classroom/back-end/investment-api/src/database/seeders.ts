import Category from '@/models/Category.ts';
import Broker from '@/models/Broker.ts';
import Investment from '@/models/Investment.ts';
import seedersData from '@/database/seeders.json' with { type: 'json' };

async function up() {
  for (const data of seedersData.categories) {
    await Category.create(data);
  }

  for (const data of seedersData.brokers) {
    await Broker.create(data);
  }

  for (const data of seedersData.investments) {
    await Investment.create(data);
  }
}

export default { up };
