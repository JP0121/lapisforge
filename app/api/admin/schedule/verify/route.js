import { NextResponse } from 'next/server';

export async function POST(request) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: true }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Access Denied' }, { status: 401 });
  }
}