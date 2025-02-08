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

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { _id, ...updateData } = await request.json();
    const transaction = await Transaction.findOneAndUpdate(
      { _id, userId: session.user.userId },
      updateData,
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update transaction' }, 
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: session.user.userId
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete transaction' }, 
      { status: 500 }
    );
  }
}