import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' }, // 最新の質問を取得
    });

    const response = NextResponse.json(questions, { status: 200 });
    
    // CORS対応: 特定のオリジンを許可
    //response.headers.set('Access-Control-Allow-Origin', 'https://enpit-2024-web2-five.vercel.app');

    // 必要に応じてすべてのオリジンを許可する場合
    response.headers.set('Access-Control-Allow-Origin', '*');

    return response;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
