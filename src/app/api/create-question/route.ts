import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, content, tags, images } = await req.json(); // imagesもリクエストデータから取得
    const tagList = tags ?? [];

    // タグを作成または取得
    const tagRecords = await Promise.all(
      tagList.map(async (tag: string) => {
        return prisma.tag.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag },
        });
      })
    );

    // 質問を作成し、画像とタグを関連付け
    const newQuestion = await prisma.question.create({
      data: {
        title,
        content,
        tags: {
          connect: tagRecords.map((tagRecord) => ({ id: tagRecord.id })),
        },
        images: {
          create: images.map((image: { binaryData: string }) => ({
            binaryData: Buffer.from(image.binaryData, 'base64'),
          })),
        }
      },
      include: {
        images: true, // 作成した質問に紐付いた画像を返す
        tags: true,
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
