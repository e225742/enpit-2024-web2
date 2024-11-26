import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tagNames = url.searchParams.get('tag')?.split(',') || []; // タグを配列として取得

  try {
    const questions = await prisma.question.findMany({
      where: tagNames.length > 0
        ? {
            tags: {
              some: {
                name: {
                  in: tagNames, // 複数のタグのいずれかを持つ
                },
              },
            },
          }
        : {},
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    });

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
