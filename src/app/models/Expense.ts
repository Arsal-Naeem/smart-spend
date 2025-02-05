import { Schema, model, models } from 'mongoose';

interface IExpense {
  userId: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
  isRecurring?: boolean;
}

const expenseSchema = new Schema<IExpense>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: String,
  isRecurring: Boolean
});

export default models.Expense || model<IExpense>('Expense', expenseSchema);