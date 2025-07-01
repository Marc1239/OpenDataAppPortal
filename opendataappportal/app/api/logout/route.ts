import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: 'admin-token',
    value: '',
    path: '/',
    maxAge: 0,
    httpOnly: true,
  });
  return response;
}
