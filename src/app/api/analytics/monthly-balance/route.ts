import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Expense from "@/app/models/Expense";
import Budget from "@/app/models/Budget";
import Income from "@/app/models/Income";

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        //? Get date ranges for past 6 months
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 5);
        startDate.setDate(1);

        //? Get all expenses for the user
        

    } catch (error) {
        
    }
}
