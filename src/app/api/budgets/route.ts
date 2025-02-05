import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Budget from '@/app/models/Budget';

export async function GET() {
  await dbConnect();
  try {
    const budgets = await Budget.find({});
    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const budget = await Budget.create(body);
    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  await dbConnect();
  try {
    const { id, ...updateData } = await request.json();
    const updatedBudget = await Budget.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedBudget);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 400 });
  }
}