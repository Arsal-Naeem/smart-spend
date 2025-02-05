import dbConnect from '@/app/lib/dbConnect';
import Expense from '@/app/models/Expense';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const expenses = await Expense.find({});
  return NextResponse.json(expenses);
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();

  try {
    const expense = await Expense.create(body);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Failed to create expense:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 400 }
    );
  }
}