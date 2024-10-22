import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const response = NextResponse.json(questions, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error: any) { // エラーが`unknown`でないことを確認
    // エラーメッセージをログに詳細表示
    console.error('Error fetching questions:', error.message || error);

    return NextResponse.json({ error: 'Failed to fetch questions', details: error.message || error }, { status: 500 });
  }
}
