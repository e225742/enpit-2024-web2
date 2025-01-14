import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tagNames = url.searchParams.get('tag')?.split(',') || []; // タグを配列として取得

  const isResolvedParam = url.searchParams.get('isResolved');
  const resolvedStatus = isResolvedParam === 'true' ? true : isResolvedParam === 'false' ? false : undefined;
  
  try {
    const questions = await prisma.question.findMany({
      where: {
        // タグフィルタリング
        tags: tagNames.length > 0
          ? {
              some: {
                name: {
                  in: tagNames, // 複数のタグのいずれかを持つ
                },
              },
            }
          : {},
        
        // 追加: isResolvedフィルタリング
        isResolved: resolvedStatus,  // isResolvedフィルタリングを追加
      },
      orderBy: { createdAt: 'desc' },
      include: { images: true, tags: true },
    });

    const formattedQuestions = questions.map((question) => ({
      ...question,
      images: question.images.map((image) => ({
        ...image,
        binaryData: Buffer.from(image.binaryData).toString('base64'), // Base64変換
      })),
    }));

    // return NextResponse.json(questions, { status: 200 });
    return NextResponse.json(formattedQuestions, { status: 200 });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
