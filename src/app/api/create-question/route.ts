import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    const newQuestion = await prisma.question.create({
      data: { title, content },
    });

    const response = NextResponse.json(newQuestion, { status: 201 });
    
    // CORS対応: 特定のオリジンを許可
    response.headers.set('Access-Control-Allow-Origin', 'https://enpit-2024-web2-five.vercel.app');

    // 必要に応じてすべてのオリジンを許可する場合
    // response.headers.set('Access-Control-Allow-Origin', '*');

    return response;
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
