import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE_PATH = path.resolve(process.cwd(), 'src', 'data', 'apps.json');

async function getAppsData() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("[Apps API] Failed to read apps data at:", DATA_FILE_PATH);
    return [];
  }
}

async function saveAppsData(apps: any[]) {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(apps, null, 2));
    console.log("[Apps API] Successfully saved apps data to:", DATA_FILE_PATH);
  } catch (error) {
    console.error("[Apps API] Failed to save apps data to:", DATA_FILE_PATH, error);
    throw error;
  }
}

export async function GET() {
  try {
    const apps = await getAppsData();
    return NextResponse.json(apps);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newApp = await request.json();
    const appRecord = {
      id: newApp.packageName ? `${newApp.packageName}-${Date.now()}` : `app-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...newApp
    };
    
    const apps = await getAppsData();
    apps.unshift(appRecord);
    await saveAppsData(apps);
    
    return NextResponse.json({ success: true, app: appRecord }, { status: 201 });
  } catch (error) {
    console.error("Failed to save app:", error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedApp = await request.json();
    if (!updatedApp.id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    const apps = await getAppsData();
    const index = apps.findIndex((a: any) => a.id === updatedApp.id);
    if (index === -1) return NextResponse.json({ error: 'App not found' }, { status: 404 });
    
    apps[index] = { ...apps[index], ...updatedApp, updatedAt: new Date().toISOString() };
    await saveAppsData(apps);
    
    return NextResponse.json({ success: true, app: apps[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    const apps = await getAppsData();
    const index = apps.findIndex((a: any) => a.id === id);
    if (index === -1) return NextResponse.json({ error: 'App not found' }, { status: 404 });
    
    apps.splice(index, 1);
    await saveAppsData(apps);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
