import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },  // 最新順に取得
    });
    const response = NextResponse.json(questions, { status: 200 });
    
    // キャッシュを無効化するヘッダーを追加
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    
    return response;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: '質問の取得に失敗しました' }, { status: 500 });
  }
}
