import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, content, tags, image } = await req.json();

    const tagRecords = await Promise.all(
      (tags ?? []).map(async (tag: string) =>
        prisma.tag.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag },
        })
      )
    );

    const newQuestion = await prisma.question.create({
      data: {
        title,
        content,
        image, // Base64形式の画像データをそのまま保存
        tags: { connect: tagRecords.map((tag) => ({ id: tag.id })) },
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
