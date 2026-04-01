import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const DATA_FILE_PATH = path.resolve(process.cwd(), 'src', 'data', 'admin.json');
    let adminEmail = 'admin@bilimod.com';
    let adminPass = 'admin123';
    
    try {
      const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed.email) adminEmail = parsed.email;
      if (parsed.password) adminPass = parsed.password;
    } catch (e) {
      console.error("[Login API] Failed to read admin data at:", DATA_FILE_PATH);
    }
    
    // Check against persistent credentials
    if (email === adminEmail && password === adminPass) {
      const response = NextResponse.json({ success: true });
      
      // Set secure auth cookie
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: false, // Set to false since user is currently on HTTP
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
      
      return response;
    }
    
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
  } catch (err) {
    console.error("[Login API] System error:", err);
    return NextResponse.json({ error: 'System error' }, { status: 500 });
  }
}
