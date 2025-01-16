import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY as string;

export async function POST(req: Request) {
  try {
    // リクエストボディから content, questionId を取得
    const { content, questionId } = await req.json();
    
    let userId: number | null = null;

    // Authorization ヘッダーを取得
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
        // トークンを検証
        const decoded = jwt.verify(token, SECRET_KEY);
        userId = (decoded as jwt.JwtPayload).id; // ログインユーザーならここに ID が入る
      } catch (error) {
        console.log("Invalid token. Treating this as an anonymous answer.");
      }
    }

    // ログインユーザーかどうかでデータを切り分ける
    const answerData: any = {
      content,
      question: {
        connect: { id: questionId },
      },
    };

    // ログインユーザーなら userId を紐付け
    if (userId !== null) {
      answerData.user = { connect: { id: userId } };
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
