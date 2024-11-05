import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tag = url.searchParams.get('tag'); // タグを取得

  try {
    const filter: Prisma.QuestionWhereInput = tag
      ? { tags: { some: { name: tag } } }
      : {}; // 型アサーションを追加

      const questions = await prisma.question.findMany({
        where: tag ? { tags: { some: { name: tag } } } : {},
        orderBy: { createdAt: 'desc' },
        include: { tags: true }, // タグ情報を含める
      });      
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
