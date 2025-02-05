import { Schema, model, models } from 'mongoose';

interface IExpense {
  amount: number;
  category: string;
  date: Date;
  description?: string;
}

const expenseSchema = new Schema<IExpense>({
  amount: { type: Number },
  category: { type: String },
  date: { type: Date, default: Date.now },
  description: String
});

export default models.Expense || model<IExpense>('Expense', expenseSchema);