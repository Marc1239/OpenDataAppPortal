import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

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

const DATA_PATH = path.join(process.cwd(), 'app', 'data', 'apps_dresden.json');

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const json = await fs.readFile(DATA_PATH, 'utf8');
  return NextResponse.json(JSON.parse(json));
}

export async function POST(req: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  await fs.writeFile(DATA_PATH, JSON.stringify(body, null, 2), 'utf8');
  return NextResponse.json({ success: true });
}
