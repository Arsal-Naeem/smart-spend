import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/app/lib/dbConnect";
import Transaction from "@/app/models/Transaction";
import Category from "@/app/models/Category";
import dayjs from "dayjs";

export async function GET() {
    try {
        await dbConnect();
        const session = await auth();

        if (!session?.user?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const startOfMonth = dayjs().startOf("month").toDate().toISOString();

        // Get monthly transactions and all transactions, plus categories
        const monthlyTransactions = await Transaction.find({
            userId: session.user.userId,
            date: { $gte: startOfMonth },
        });

        const allTransactions = await Transaction.find({
            userId: session.user.userId,
        });

        const categories = await Category.find({
            userId: session.user.userId
        });

        // Calculate monthly stats
        const monthlyIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calculate total budget across all categories
        const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);

        // Calculate budget utilization percentage
        const budgetUtilization = totalBudget > 0 
            ? (monthlyExpenses / totalBudget) * 100 
            : 0;

        // Calculate current balance as net amount of all time (income - expenses)
        const allTimeIncome = allTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const allTimeExpenses = allTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentBalance = allTimeIncome - allTimeExpenses;

        const stats = {
            currentBalance,
            monthlyIncome,
            monthlyExpenses,
            budgetUtilization: budgetUtilization.toFixed(2),
        };

        return NextResponse.json(stats);

    } catch (err) {
        return NextResponse.json(
            { error: "Failed to fetch transactions", err },
            { status: 500 }
        );
    }
}

