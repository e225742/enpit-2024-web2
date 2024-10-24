import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 最新の質問を取得するクエリ
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' }, // 質問を作成日時順に並べ替え
    });

    return NextResponse.json(questions);
  } catch (error: any) {
    // エラーの詳細をコンソールに出力
    console.error('Error fetching questions:', error.message || error);

    // エラーメッセージをレスポンスに返す
    return NextResponse.json({ error: error.message || 'Unknown error occurred' }, { status: 500 });
  }
}
