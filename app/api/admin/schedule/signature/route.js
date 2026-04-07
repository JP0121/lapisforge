import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '../../../../../lib/mongodb';
import Appointment from '../../../../../models/appointment';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Grab the ID and the huge signature image data from the frontend
    const { id, signature } = await request.json();

    if (!id || !signature) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // --- 1. THE DATABASE FIX ---
    // Instead of saving the massive image string to MongoDB, we just save a lightweight text flag!
    // This prevents database bloat but still tells the frontend to remove them from the "Unsigned" list.
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { signature: 'Signed & Emailed', signedAt: new Date(), status: 'Completed & Signed' },
      { new: true } 
    );

    // --- 2. PREP THE IMAGE ---
    // We strip the data URL prefix so Nodemailer can convert it into a real .png file
    const base64Data = signature.split(';base64,').pop();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
    });

    const receiptText = `Hi ${updatedAppointment.name},\n\n` +
      `Your repair for the ${updatedAppointment.brand} ${updatedAppointment.device} is officially complete! ` +
      `Below is a copy of your signed 30-Day Limited Warranty agreement for your records.\n\n` +
      `Service Performed: ${updatedAppointment.service}\n` +
      `Signed On: ${updatedAppointment.signedAt.toLocaleString()}\n\n` +
      `WARRANTY TERMS:\n` +
      `1. Covers defective parts and workmanship only.\n` +
      `2. Strictly void if device shows physical damage (dropped, cracked, bent), liquid damage, or third-party tampering.\n` +
      `3. Not responsible for pre-existing conditions.\n\n` +
      `A copy of your digital signature is attached to this email.\n\n` +
      `Thank you for choosing JP's Tech Garage!\n` +
      `- JP`;

    // --- 3. THE EMAIL FIX ---
    await transporter.sendMail({
      from: `"JP's Tech Garage" <${process.env.EMAIL_USER}>`,
      to: updatedAppointment.email,
      bcc: process.env.EMAIL_USER, // NEW: Sends a hidden carbon-copy straight to your inbox!
      subject: `Repair Completed & Warranty Receipt: JP's Tech Garage`,
      text: receiptText,
      attachments: [
        {
          // Creates a clean file name like "Jacob_P_Signature.png"
          filename: `${updatedAppointment.name.replace(/\s+/g, '_')}_Signature.png`,
          content: base64Data,
          encoding: 'base64'
        }
      ]
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Signature save error:", error);
    return NextResponse.json({ error: 'Failed to save signature' }, { status: 500 });
  }
}