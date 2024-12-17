import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = "secret";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // IDバリデーション
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  // Authorizationヘッダーからトークンを取得
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  const token = authHeader.substring(7); // "Bearer "を除去

  // トークンを検証し、ユーザーIDを取得
  let decoded: any;
  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userId = decoded.id;

  try {
    // 質問を取得し、投稿者IDと現在のユーザーIDを比較
    const question = await prisma.question.findUnique({ where: { id: Number(id) } });
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // 投稿者以外が解決リクエストなら403
    if (question.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 本人の場合は更新処理
    const updatedQuestion = await prisma.question.update({
      where: { id: Number(id) },
      data: { isResolved: true },
    });

    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

export function OPTIONS() {
  return NextResponse.json(
    { message: "Method Allowed" },
    {
      status: 200,
      headers: { Allow: "PATCH, OPTIONS" },
    }
  );
}
