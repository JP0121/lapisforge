import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import Appointment from '../../../../models/appointment';

export async function GET(request) {
  try {
    // 1. Check Admin Password to keep customer data safe
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    await connectToDatabase();
    
    // 2. Fetch all appointments from the database, sorted by newest first
    const appointments = await Appointment.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, appointments }, { status: 200 });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}