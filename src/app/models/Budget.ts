import { Schema, model, models } from 'mongoose';

interface IBudget {
  userId: string;
  category: string;
  monthlyLimit: number;
}

const budgetSchema = new Schema<IBudget>({
  userId: { type: String, required: true },
  category: { type: String, required: true, unique: true },
  monthlyLimit: { type: Number, required: true }
});

export default models.Budget || model<IBudget>('Budget', budgetSchema);