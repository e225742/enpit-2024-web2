import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' }, // 最新順で取得
    });

    const response = NextResponse.json(questions, { status: 200 });
    response.headers.set('Cache-Control', 'no-store, max-age=0'); // キャッシュを無効化
    return response;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: '質問の取得に失敗しました' }, { status: 500 });
  }
}
