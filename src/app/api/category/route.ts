import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/app/lib/dbConnect';
import Category from '@/app/models/Category';
import Transaction from '@/app/models/Transaction';
import dayjs from 'dayjs';

// GET all categories for the authenticated user
export async function GET() {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await Category.find({ userId: session.user.userId });
    const startOfMonth = dayjs().startOf('month').toDate();
    
    // Get transactions for calculating monthly spend
    const transactions = await Transaction.find({
      userId: session.user.userId,
      type: 'expense',
      date: { $gte: startOfMonth }
    });

    // Calculate monthly spend per category
    const monthlySpendByCategory = transactions.reduce((acc, transaction) => {
      if (transaction.category) {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    const categoryData = categories.map(category => ({
      _id: category._id,
      category: category.categoryName,
      amount: category.totalSpend,
      color: category.color,
      totalSpend: category.totalSpend,
      totalSpentThisMonth: monthlySpendByCategory[category.categoryName] || 0,
      transactionCount: category.transactionCount,
      budget: category.budget
    }));

    return NextResponse.json(categoryData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const category = await Category.create({
      ...body,
      userId: session.user.userId,
      totalSpend: 0,
      transactionCount: 0
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 400 }
    );
  }
}

// PUT - Update a category
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const session = await auth();

    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { _id, ...updateData } = await request.json();
    const category = await Category.findOneAndUpdate(
      { _id, userId: session.user.userId },
      updateData,
      { new: true }
    );

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 400 }
    );
  }
}

// DELETE - Delete a category
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
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    const category = await Category.findOneAndDelete({
      _id: id,
      userId: session.user.userId
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}