import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    // エラー内容を詳しくログに出力
    console.error('Error fetching questions from database:', error);

    // エラーメッセージをクライアントに返す
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
