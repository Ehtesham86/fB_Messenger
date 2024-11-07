// app/api/sendEmail/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  const { to, subject, text } = await request.json();

  if (!to || !subject || !text) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Ensure `to` is a comma-separated string if it's an array
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: Array.isArray(to) ? to.join(', ') : to, // Handles array of emails
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent', info });
  } catch (error) {
    return NextResponse.json({ message: 'Email sending failed', error }, { status: 500 });
  }
}
