import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'subscribers.json');

async function getSubscribersData() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveSubscribersData(subs: any[]) {
  const dir = path.dirname(DATA_FILE_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(subs, null, 2));
}

export async function GET() {
  try {
    const subs = await getSubscribersData();
    return NextResponse.json(subs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const subs = await getSubscribersData();
    
    if (subs.find((s: any) => s.email === data.email)) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 });
    }
    
    const newRecord = {
      id: `sub-${Date.now()}`,
      email: data.email,
      status: "Active",
      date: new Date().toISOString().split('T')[0]
    };
    
    subs.unshift(newRecord);
    await saveSubscribersData(subs);
    
    return NextResponse.json({ success: true, subscriber: newRecord }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    const subs = await getSubscribersData();
    const index = subs.findIndex((s: any) => s.id === id);
    if (index === -1) return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    
    subs.splice(index, 1);
    await saveSubscribersData(subs);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
