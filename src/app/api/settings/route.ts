import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'settings.json');

export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ 
      siteName: "Bili Mod", 
      supportEmail: "animebolt786@gmail.com", 
      metaDescription: "Your trusted platform for safe, fast, and secure Android app and game mod downloads." 
    });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const dir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, settings: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
