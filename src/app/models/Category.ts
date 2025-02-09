import {Schema, model, models} from 'mongoose';

interface ICategory {
    userId: string;
    categoryName: string;
    totalSpend: number;
    budget: number;
    transactionCount: number;
    color?: string
}

const categorySchema = new Schema<ICategory>({
    userId: { type: String, required: true },
    categoryName: { type: String, required: true, unique: true },
    totalSpend: { type: Number, required: true },
    budget: { type: Number, required: true },
    transactionCount: { type: Number, required: true },
    color: { type: String, required: false }
});

export default models.Category || model<ICategory>('Category', categorySchema);