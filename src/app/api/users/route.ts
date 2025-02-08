import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import User from '@/app/models/User';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const user = await User.findOne({ userId });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const updatedUser = await User.findOneAndUpdate(
      { userId: body.userId },
      body,
      { new: true }
    );
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 400 });
  }
}