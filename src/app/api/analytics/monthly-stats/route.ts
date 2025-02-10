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

        const startOfMonth = dayjs().startOf("month").toDate();

        // Get all transactions and categories
        const transactions = await Transaction.find({
            userId: session.user.userId,
            date: { $gte: startOfMonth },
        });

        const categories = await Category.find({
            userId: session.user.userId
        });

        // Calculate monthly stats
        const monthlyIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calculate total budget across all categories
        const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);

        // Calculate budget utilization percentage
        const budgetUtilization = totalBudget > 0 
            ? (monthlyExpenses / totalBudget) * 100 
            : 0;

        // Calculate current balance (income - expenses)
        const currentBalance = monthlyIncome - monthlyExpenses;

        const stats = {
            currentBalance,
            monthlyIncome,
            monthlyExpenses,
            budgetUtilization: Math.round(budgetUtilization)
        };

        return NextResponse.json(stats);

    } catch (err) {
        return NextResponse.json(
            { error: "Failed to fetch transactions", err },
            { status: 500 }
        );
    }
}

