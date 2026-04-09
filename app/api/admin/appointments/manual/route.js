import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../../lib/mongodb';
import Appointment from '../../../../../models/appointment';
import Schedule from '../../../../../models/schedule'; 

export async function POST(request) {
  try {
    // 1. Verify Admin Access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    await connectToDatabase();
    const formData = await request.json();

    // 2. Create the Appointment and bypass the pending status
    const newAppointment = await Appointment.create({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      category: 'Manual Entry',
      brand: 'Custom/Walk-in',
      device: formData.device,
      modelNumber: 'N/A',
      service: formData.service,
      message: formData.message || 'Booked manually by Admin.',
      bookingDate: formData.bookingDate,
      bookingTime: formData.bookingTime,
      locationType: 'dropoff',
      address: '',
      // This is the magic line that overrides the deposit
      paymentStatus: formData.depositStatus 
    });

    // 3. Remove the time slot from the live calendar so no one double-books you!
    if (formData.bookingDate && formData.bookingTime) {
      await Schedule.findOneAndUpdate(
        { date: formData.bookingDate },
        { $pull: { timeSlots: formData.bookingTime } }
      );
    }

    return NextResponse.json({ success: true, appointment: newAppointment }, { status: 200 });

  } catch (error) {
    console.error("Manual booking error:", error);
    return NextResponse.json({ error: 'Failed to create manual booking' }, { status: 500 });
  }
}