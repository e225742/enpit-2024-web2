import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, content, tags } = await req.json();

    // tags が未定義の場合、空の配列を使う
    const tagList = tags ?? [];

    const newQuestion = await prisma.question.create({
      data: {
        title,
        content,
        tags: {
          connectOrCreate: tagList.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
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
