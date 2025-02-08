import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/app/lib/dbConnect';
import Transaction from '@/app/models/Transaction';

export async function GET() {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await Transaction.find({ userId: session.user.userId });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transactions' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const transaction = await Transaction.create({
      ...body,
      userId: session.user.userId // Ensure userId is set from the session
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create transaction' }, 
      { status: 400 }
    );
  }
}