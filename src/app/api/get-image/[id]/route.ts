import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const image = await prisma.image.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!image) {
      return NextResponse.json({ success: false, message: 'Image not found' }, { status: 404 });
    }

    return new Response(image.binaryData, {
      headers: {
        'Content-Type': 'image/jpeg', // 必要に応じて動的に変更
        'Content-Length': image.binaryData.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch image' }, { status: 500 });
  }
}
