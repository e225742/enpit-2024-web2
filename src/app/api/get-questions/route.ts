import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // データベースから全ての質問を取得
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' }, // 質問を作成日時で並べ替え
    });

    // 正常なレスポンス
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    // エラーハンドリング
    console.error('Error fetching questions from the database:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
