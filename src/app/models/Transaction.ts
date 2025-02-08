import { Schema, model, models } from 'mongoose';

export interface ITransaction {
    userId: string;
    type: "income" | "expense";
    amount: number;
    date: string;
    category?: string;
    notes?: string;
}

const transactionSchema = new Schema<ITransaction>({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    category: String,
    notes: String
});

export default models.Transaction || model<ITransaction>('Transaction', transactionSchema);