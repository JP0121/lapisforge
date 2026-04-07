import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase } from '../../../lib/mongodb';
import Appointment from '../../../models/appointment';
import Schedule from '../../../models/schedule';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const formData = await request.json();
    await connectToDatabase();

    // 1. Save the appointment as "Pending"
    const newAppointment = await Appointment.create({
      ...formData,
      paymentStatus: 'Pending',
    });

    // 2. Reserve the time slot immediately so no one else can book it
    await Schedule.findOneAndUpdate(
      { date: formData.bookingDate },
      { $pull: { timeSlots: formData.bookingTime } }
    );

    // 3. Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: "JP's Tech Garage - Diagnostic Deposit",
              description: `Booking for: ${formData.brand} ${formData.device}`,
            },
            unit_amount: 2500, // $25.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // We pass the new database ID in the success URL so we can find it later!
      success_url: `${request.headers.get('origin')}/api/verify?id=${newAppointment._id}`,
      cancel_url: `${request.headers.get('origin')}/`,
    });

    // 4. Send the Stripe URL back to the frontend so it can redirect the user
    return NextResponse.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: 'Payment routing failed' }, { status: 500 });
  }
}