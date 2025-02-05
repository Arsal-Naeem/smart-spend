import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Income from '@/app/models/Income';

export async function GET() {
  await dbConnect();
  try {
    const incomes = await Income.find({});
    return NextResponse.json(incomes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch incomes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const income = await Income.create(body);
    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create income' }, { status: 400 });
  }
}