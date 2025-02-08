import { Schema, model, models } from 'mongoose';

interface IRecurring {
  userId: string;
  amount: number;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextDueDate: Date;
  type: 'expense' | 'income';
}

const recurringSchema = new Schema<IRecurring>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  nextDueDate: { type: Date, required: true },
  type: { type: String, enum: ['expense', 'income'], required: true }
});

export default models.Recurring || model<IRecurring>('Recurring', recurringSchema);