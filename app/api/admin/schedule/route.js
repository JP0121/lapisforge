import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import Schedule from '../../../../models/schedule';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    await connectToDatabase();
    
    const { date, timeSlots } = await request.json();

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const updatedSchedule = await Schedule.findOneAndUpdate(
      { date: date }, 
      { timeSlots: timeSlots }, 
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, schedule: updatedSchedule }, { status: 200 });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: 'Failed to save schedule' }, { status: 500 });
  }
}