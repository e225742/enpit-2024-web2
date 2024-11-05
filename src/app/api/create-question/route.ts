import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, content, tags } = await req.json();

    // タグが未定義の場合、空の配列を使用
    const tagList = tags ?? [];

    // タグを個別に作成し、存在する場合は取得
    const tagRecords = await Promise.all(
      tagList.map(async (tag: string) => {
        return prisma.tag.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag },
        });
      })
    );

    // 質問を作成し、タグと関連付け
    const newQuestion = await prisma.question.create({
      data: {
        title,
        content,
        tags: {
          connect: tagRecords.map(tagRecord => ({ id: tagRecord.id })),
        },
      },
    });

    const response = NextResponse.json(newQuestion, { status: 201 });
    response.headers.set('Access-Control-Allow-Origin', 'https://enpit-2024-web2-five.vercel.app');
    return response;
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
