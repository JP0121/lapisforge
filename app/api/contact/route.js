import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  const { name, email, service, message } = await request.json();

  // 1. Format the message for Telegram & Email
  const notificationText = `🔧 NEW REQUEST: JP's Tech Garage\n\nName: ${name}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`;

  try {
    // 2. Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: notificationText,
      }),
    });

    // 3. Send Email via Nodemailer (Example using Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      replyTo: email,
      subject: `New Tech Garage Request: ${service} from ${name}`,
      text: notificationText,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}