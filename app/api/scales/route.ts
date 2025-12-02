import { NextResponse } from 'next/server';

const scales = [ '1:18', '1:24', '1:48', '1:72', '1:100', '1:200', '1:700' ];

export async function GET() {
  return NextResponse.json(scales);
}