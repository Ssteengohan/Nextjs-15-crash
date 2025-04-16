import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: Request) {
  const isSanityStudio = request.headers.get('referer')?.includes('/studio') || false;
  
  if (!isSanityStudio) {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return new NextResponse('File must be an image', { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return new NextResponse('File size exceeds 50MB limit', { status: 400 });
    }

    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    const storageZone = process.env.BUNNY_STORAGE_ZONE;
    const region = process.env.BUNNY_STORAGE_REGION || 'de';
    
    const buffer = await file.arrayBuffer();
    
    const uploadUrl = `https://storage.bunnycdn.com/${storageZone}/${fileName}`;
    
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': process.env.BUNNY_API_KEY || '',
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bunny CDN upload error:', errorText);
      return new NextResponse(`Bunny CDN upload failed: ${errorText}`, { status: 500 });
    }

    const cdnUrl = `${process.env.BUNNY_PULL_ZONE}/${fileName}`;

    return NextResponse.json({ success: true, url: cdnUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}