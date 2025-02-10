import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Budget from '@/app/models/Budget';

export async function GET() {
  await dbConnect();
  try {
    const budgets = await Budget.find({});
    return NextResponse.json(budgets);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch budgets', err }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const budget = await Budget.create(body);
    return NextResponse.json(budget, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create budget', err }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  await dbConnect();
  try {
    const { id, ...updateData } = await request.json();
    const updatedBudget = await Budget.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedBudget);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update budget', err }, { status: 400 });
  }
}