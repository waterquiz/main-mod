import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'admin.json');

async function getAdminData() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { email: 'admin@bilimod.com', password: 'admin123' };
  }
}

export async function GET() {
  const admin = await getAdminData();
  return NextResponse.json({ email: admin.email, password: admin.password });
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const dir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify({ email: data.email, password: data.password }, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update credentials' }, { status: 500 });
  }
}
