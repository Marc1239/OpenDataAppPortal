import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { user, pass } = await req.json();
  if (
    user === process.env.ADMIN_USER &&
    pass === process.env.ADMIN_PASS
  ) {
    
    const token = Buffer.from(`${user}:${pass}`).toString('base64');
    const res = NextResponse.json({ success: true });
    res.cookies.set({
      name: 'admin-token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return res;
  }
  return NextResponse.json({ success: false }, { status: 401 });
}
