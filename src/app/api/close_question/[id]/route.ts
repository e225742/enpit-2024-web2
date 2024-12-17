import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * PATCHリクエストハンドラ
 * @param req - リクエストオブジェクト
 * @param params - URLパラメータ
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // IDのバリデーション
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    // Prismaを使ったデータベース更新
    const updatedQuestion = await prisma.question.update({
      where: { id: Number(id) },
      data: { isResolved: true },
    });

    // 更新後のデータを返却
    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

/**
 * OPTIONSリクエストハンドラ
 * (CORSやメソッド許可のため)
 */
export function OPTIONS() {
  return NextResponse.json(
    { message: "Method Allowed" },
    {
      status: 200,
      headers: { Allow: "PATCH, OPTIONS" },
    }
  );
}
