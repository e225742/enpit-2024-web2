import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: 'タイトルと内容は必須です' }, { status: 400 });
  }

  try {
    const question = await prisma.question.create({
      data: {
        title,
        content,
      },
    });
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '質問の作成に失敗しました' }, { status: 500 });
  }
}
