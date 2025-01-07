import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY as string;

export async function POST(req: Request) {
  try {
    const { content, questionId } = await req.json();
    
    let userId: number | null = null;

    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        userId = (decoded as jwt.JwtPayload).id; // ログインユーザーならここに ID が入る
      } catch (error) {
        console.log("Invalid token, treating as anonymous answer.");
      }
    }

    // userId が null かどうかで、リレーション用の data を出し分ける
    const answerData: any = {
      content,
      question: {
        connect: { id: questionId },
      },
    };
    
    // ログインユーザーなら userId をリレーションで connect する
    if (userId !== null) {
      answerData.user = {
        connect: { id: userId },
      };
    }

    const newAnswer = await prisma.answer.create({
      data: answerData,
    });

    return NextResponse.json(newAnswer, { status: 201 });
  } catch (error) {
    console.error('Error creating answer:', error);
    return NextResponse.json(
      { error: 'Failed to create answer' },
      { status: 500 }
    );
  }
}
