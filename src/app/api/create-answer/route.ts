// src/app/api/create-answer/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { content, questionId } = await req.json();

    const newAnswer = await prisma.answer.create({
      data: {
        content,
        question: {
          connect: { id: questionId },
        },
      },
    });

    return NextResponse.json(newAnswer, { status: 201 });
  } catch (error) {
    console.error('Error creating answer:', error);
    return NextResponse.json({ error: 'Failed to create answer' }, { status: 500 });
  }
}
