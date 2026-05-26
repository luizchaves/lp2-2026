import Investment from '@/models/Investment.ts';
import seedersData from '@/database/seeders.json' with { type: 'json' };

const models = {
  investments: Investment,
} satisfies Record<
  keyof typeof seedersData,
  { create: (data: any) => Promise<any> }
>;

async function up() {
  for (const [model, values] of Object.entries(seedersData)) {
    for (const value of values) {
      await models[model as keyof typeof models].create(value);
    }
  }
}

export default { up };
