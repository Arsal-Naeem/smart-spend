import { Schema, model, models } from 'mongoose';

interface IIncome {
  userId: string;
  amount: number;
  source: string;
  date: Date;
  description?: string;
}

const incomeSchema = new Schema<IIncome>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  source: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: String
});

export default models.Income || model<IIncome>('Income', incomeSchema);