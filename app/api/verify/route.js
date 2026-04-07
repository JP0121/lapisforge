import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '../../../lib/mongodb';
import Appointment from '../../../models/appointment';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.redirect(new URL('/', request.url));

  try {
    await connectToDatabase();

    const appointment = await Appointment.findById(id);

    if (!appointment || appointment.paymentStatus === 'Paid') {
      return NextResponse.redirect(new URL('/success', request.url));
    }

    appointment.paymentStatus = 'Paid';
    await appointment.save();

    const locationText = appointment.locationType === 'mobile' ? `🚗 We Come To You\nAddress: ${appointment.address}` : `🏢 Garage Drop-off`;

    // --- 1. ADMIN ALERT MESSAGE ---
    const notificationText = `💰 NEW PAID BOOKING: JP's Tech Garage\n\n` +
      `Name: ${appointment.name}\n` +
      `Email: ${appointment.email}\n` +
      `Category: ${appointment.category}\n` +
      `Device: ${appointment.brand} ${appointment.device}\n` +
      `Model #: ${appointment.modelNumber}\n` +
      `Service: ${appointment.service}\n\n` +
      `Date: ${appointment.bookingDate}\n` +
      `Time: ${appointment.bookingTime}\n` +
      `Location: ${locationText}\n\n` +
      `Message: ${appointment.message}\n\n` +
      `Status: ✅ $25 Deposit PAID`;

    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: notificationText }),
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
    });

    // Send Alert to YOU (The Admin)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: appointment.email,
      subject: `✅ PAID Booking: ${appointment.device} - ${appointment.service}`,
      text: notificationText,
    });

    // --- 2. NEW: CUSTOMER CONFIRMATION EMAIL ---
    const customerEmailText = `Hi ${appointment.name},\n\n` +
      `Thank you for choosing JP's Tech Garage! Your $25 diagnostic deposit has been securely processed and your time slot is locked in.\n\n` +
      `Here are your appointment details:\n` +
      `Device: ${appointment.brand} ${appointment.device}\n` +
      `Service: ${appointment.service}\n` +
      `Date: ${appointment.bookingDate}\n` +
      `Time: ${appointment.bookingTime}\n` +
      `Location: ${appointment.locationType === 'mobile' ? `Mobile Repair at: ${appointment.address}` : 'Drop-off at the Garage'}\n\n` +
      `If you need to make any changes to this appointment, please reply directly to this email.\n\n` +
      `See you soon!\n` +
      `- JP's Tech Garage`;

    // Send Confirmation to the CUSTOMER
    await transporter.sendMail({
      from: `"JP's Tech Garage" <${process.env.EMAIL_USER}>`, // Looks professional in their inbox
      to: appointment.email, // Sends directly to the email they typed in the form
      subject: `Booking Confirmed: JP's Tech Garage`,
      text: customerEmailText,
    });

    return NextResponse.redirect(new URL('/success', request.url));

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}