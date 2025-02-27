import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/app/lib/dbConnect';
import Transaction from '@/app/models/Transaction';
import dayjs from 'dayjs';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await auth();
    
    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: any = { userId: session.user.userId };

    if (type === 'monthly' && month && year) {
      const startOfMonth = dayjs(`${year}-${month}-01`).startOf('month');
      const endOfMonth = startOfMonth.endOf('month');
      
      query.date = {
        $gte: startOfMonth.toDate(),
        $lte: endOfMonth.toDate()
      };
    } else if (type === 'yearly' && year) {
      const startOfYear = dayjs(`${year}-01-01`).startOf('year');
      const endOfYear = startOfYear.endOf('year');
      
      query.date = {
        $gte: startOfYear.toDate(),
        $lte: endOfYear.toDate()
      };
    } else if (type === 'range' && startDate && endDate) {
      query.date = {
        $gte: dayjs(startDate).startOf('day').toDate(),
        $lte: dayjs(endDate).endOf('day').toDate()
      };
    }

    const transactions = await Transaction.find(query).sort({ date: 1 });

    // Calculate totals
    const totals = transactions.reduce((acc, curr) => {
      if (curr.type === 'income') {
        acc.totalIncome += curr.amount;
      } else {
        acc.totalExpense += curr.amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpense: 0 });

    return NextResponse.json({
      transactions,
      totals,
      period: {
        type,
        month,
        year,
        startDate,
        endDate
      }
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch statement data', err }, 
      { status: 500 }
    );
  }
}