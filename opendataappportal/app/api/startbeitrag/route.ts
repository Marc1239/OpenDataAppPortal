import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const DATA_PATH = path.join(process.cwd(), 'app', 'data', 'startbeitrag.json');

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  if (!token) return false;
  const [user, pass] = Buffer.from(token, 'base64').toString().split(':');
  return (
    user === process.env.ADMIN_USER &&
    pass === process.env.ADMIN_PASS
  );
}

export async function GET() {
  const text = await fs.readFile(DATA_PATH, 'utf8');
  return NextResponse.json(JSON.parse(text));
}

export async function POST(req: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  await fs.writeFile(DATA_PATH, JSON.stringify(body, null, 2), 'utf8');
  return NextResponse.json({ success: true });
}
