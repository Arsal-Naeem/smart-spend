import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/app/lib/dbConnect';
import Debt from '@/app/models/Debt';
import Transaction from '@/app/models/Transaction';
import Category from '@/app/models/Category';

// POST - Add a payment transaction to a debt
export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { debtId, type, amount, date, notes, reason, category, title } = body;

    if (!debtId || !type || !amount || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: debtId, type, amount, date' }, 
        { status: 400 }
      );
    }

    if (!['return', 'add'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "return" or "add"' }, 
        { status: 400 }
      );
    }

    // Find the debt and verify ownership
    const debt = await Debt.findOne({
      _id: debtId,
      userId: session.user.userId
    });

    if (!debt) {
      return NextResponse.json(
        { error: 'Debt not found or unauthorized' }, 
        { status: 404 }
      );
    }

    // Validate return amount doesn't exceed remaining
    if (type === 'return' && amount > debt.amountRemaining) {
      return NextResponse.json(
        { error: 'Return amount cannot exceed remaining amount' }, 
        { status: 400 }
      );
    }

    // Create the transaction object
    const transactionData = {
      type,
      amount,
      date,
      notes,
      reason,
      category
    };

    // Update debt based on transaction type
    let amountPaidUpdate = 0;
    let totalAmountUpdate = 0;

    if (type === 'return') {
      amountPaidUpdate = amount;
    } else {
      // 'add' type - adding more to the debt
      totalAmountUpdate = amount;
    }

    const updatedDebt = await Debt.findByIdAndUpdate(
      debtId,
      {
        $push: { transactions: transactionData },
        $inc: { 
          amountPaid: amountPaidUpdate,
          totalAmount: totalAmountUpdate,
          amountRemaining: type === 'return' ? -amount : amount
        }
      },
      { new: true }
    );

    // Check if debt is fully paid and update status
    if (updatedDebt && updatedDebt.amountRemaining <= 0) {
      await Debt.findByIdAndUpdate(debtId, {
        $set: { 
          status: 'completed',
          amountRemaining: 0 // Ensure it doesn't go negative
        }
      });
    }

    // If the debt type is 'taken' and transaction type is 'add', 
    // create an expense transaction to track spending
    if (debt.debtType === 'taken' && type === 'add' && category) {
      await Transaction.create({
        userId: session.user.userId,
        title: title || reason || `Debt expense - ${debt.title}`,
        type: 'expense',
        amount,
        date,
        category,
        notes: notes || `Added to debt: ${debt.title}`
      });

      // Update category total spend
      await Category.findOneAndUpdate(
        { 
          userId: session.user.userId,
          categoryName: category 
        },
        { 
          $inc: { 
            totalSpend: amount,
            transactionCount: 1
          } 
        }
      );
    }

    return NextResponse.json({
      message: `Payment ${type === 'return' ? 'returned' : 'added'} successfully`,
      debt: updatedDebt
    }, { status: 201 });
  } catch (err) {
    console.error('Error processing debt payment:', err);
    return NextResponse.json(
      { error: 'Failed to process payment', details: err }, 
      { status: 400 }
    );
  }
}

// GET - Get debt summary (total outstanding debt and credit)
export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get summary of active debts
    const summary = await Debt.aggregate([
      { $match: { userId: session.user.userId, status: 'active' } },
      {
        $group: {
          _id: '$debtType',
          totalRemaining: { $sum: '$amountRemaining' },
          totalAmount: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$amountPaid' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format the response
    const result = {
      outstandingDebt: 0,  // Money I owe (taken)
      outstandingCredit: 0, // Money others owe me (given)
      takenCount: 0,
      givenCount: 0
    };

    summary.forEach(item => {
      if (item._id === 'taken') {
        result.outstandingDebt = item.totalRemaining;
        result.takenCount = item.count;
      } else if (item._id === 'given') {
        result.outstandingCredit = item.totalRemaining;
        result.givenCount = item.count;
      }
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('Error fetching debt summary:', err);
    return NextResponse.json(
      { error: 'Failed to fetch debt summary', details: err }, 
      { status: 500 }
    );
  }
}
