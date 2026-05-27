import type { Category } from '@/types/Category.d.ts';
import type { Broker } from '@/types/Broker.d.ts';

export interface Investment {
  id: string;
  name: string;
  amount: number;
  interest: string;
  createdAt: string;
  categoryId: string;
  brokerId: string;
  category?: Category;
  broker?: Broker;
}

export interface InvestmentInput {
  name?: string;
  amount?: number;
  interest?: string;
  categoryId?: string;
  brokerId?: string;
}
