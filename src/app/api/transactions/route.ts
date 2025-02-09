import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/app/lib/dbConnect';
import Transaction from '@/app/models/Transaction';
import Category from '@/app/models/Category';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get type from query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Build query object
    const query: { userId: string; type?: "income" | "expense" } = {
      userId: session.user.userId
    };

    // Add type to query if valid
    if (type && ['income', 'expense'].includes(type)) {
      query.type = type as "income" | "expense";
    }

    const transactions = await Transaction.find(query);
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
      userId: session.user.userId
    });

    // Update category if transaction is an expense
    if (transaction.type === 'expense' && transaction.category) {
      await Category.findOneAndUpdate(
        { 
          userId: session.user.userId,
          categoryName: transaction.category 
        },
        { 
          $inc: { 
            totalSpend: transaction.amount,
            transactionCount: 1
          } 
        }
      );
    }

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
    
    // Get the original transaction
    const originalTransaction = await Transaction.findOne({ 
      _id, 
      userId: session.user.userId 
    });

    if (!originalTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Update the transaction
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id, userId: session.user.userId },
      updateData,
      { new: true }
    );

    // Handle category updates for expenses
    if (originalTransaction.type === 'expense') {
      // Decrement original category
      if (originalTransaction.category) {
        await Category.findOneAndUpdate(
          {
            userId: session.user.userId,
            categoryName: originalTransaction.category
          },
          {
            $inc: {
              totalSpend: -originalTransaction.amount,
              transactionCount: -1
            }
          }
        );
      }

      // Increment new category
      if (updatedTransaction.type === 'expense' && updatedTransaction.category) {
        await Category.findOneAndUpdate(
          {
            userId: session.user.userId,
            categoryName: updatedTransaction.category
          },
          {
            $inc: {
              totalSpend: updatedTransaction.amount,
              transactionCount: 1
            }
          }
        );
      }
    }

    return NextResponse.json(updatedTransaction);
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

    // Get the transaction before deleting
    const transaction = await Transaction.findOne({
      _id: id,
      userId: session.user.userId
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Update category if it's an expense transaction
    if (transaction.type === 'expense' && transaction.category) {
      await Category.findOneAndUpdate(
        {
          userId: session.user.userId,
          categoryName: transaction.category
        },
        {
          $inc: {
            totalSpend: -transaction.amount,
            transactionCount: -1
          }
        }
      );
    }

    // Delete the transaction
    await Transaction.deleteOne({ _id: id, userId: session.user.userId });

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete transaction' }, 
      { status: 500 }
    );
  }
}