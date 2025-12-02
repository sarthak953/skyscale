import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();
    // Here you would send an email, store in DB, or forward to support
    // For now, just return success
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
