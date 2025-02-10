import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Recurring from '@/app/models/Recurring';

export async function GET() {
  await dbConnect();
  try {
    const recurrings = await Recurring.find({});
    return NextResponse.json(recurrings);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch recurrings', err }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const recurring = await Recurring.create(body);
    return NextResponse.json(recurring, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create recurring', err }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const { id } = await request.json();
    await Recurring.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete recurring', err }, { status: 400 });
  }
}