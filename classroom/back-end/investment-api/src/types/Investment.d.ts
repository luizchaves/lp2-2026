import type { Category } from '@/types/Category.d.ts';
import type { Broker } from '@/types/Broker.d.ts';
import type { User } from '@/types/User.d.ts';

export interface Investment {
  id: string;
  name: string;
  amount: number;
  interest: string;
  createdAt: Date;
  dueDate: Date;
  categoryId: string;
  brokerId: string;
  userId: string;
  category?: Category;
  broker?: Broker;
  user?: User;
}

export interface InvestmentInput {
  name?: string;
  amount?: number;
  interest?: string;
  dueDate?: string;
  categoryId?: string;
  brokerId?: string;
  userId?: string;
}
