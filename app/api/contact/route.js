import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '../../../lib/mongodb';
import Appointment from '../../../models/appointment';
import Schedule from '../../../models/schedule';

export async function POST(request) {
  // NEW: Added locationType and address extraction
  const { name, email, category, brand, device, modelNumber, service, message, bookingDate, bookingTime, locationType, address } = await request.json();

  try {
    await connectToDatabase();

    // NEW: Save location data to MongoDB
    await Appointment.create({
      name, email, category, brand, device, modelNumber, service, message, bookingDate, bookingTime, locationType, address
    });

    await Schedule.findOneAndUpdate(
      { date: bookingDate },
      { $pull: { timeSlots: bookingTime } }
    );

    // NEW: Added Location Logic for Telegram Message
    const locationText = locationType === 'mobile' ? `🚗 We Come To You\nAddress: ${address}` : `🏢 Garage Drop-off`;

    const notificationText = `🔧 NEW REQUEST: JP's Tech Garage\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Category: ${category}\n` +
      `Device: ${brand} ${device}\n` +
      `Model #: ${modelNumber}\n` +
      `Service: ${service}\n\n` +
      `Date: ${bookingDate}\n` +
      `Time: ${bookingTime}\n` +
      `Location: ${locationText}\n\n` +
      `Message: ${message}`;

    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: notificationText,
      }),
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Tech Garage Request: ${device} - ${service}`,
      text: notificationText,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}