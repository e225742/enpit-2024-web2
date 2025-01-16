import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY as string;

export async function POST(req: NextRequest) {
  try {

    const { title, content, tags, images } = await req.json(); // imagesもリクエストデータから取得
    const tagList = tags ?? [];

    // タグを作成または取得

    // Authorizationヘッダーからトークンを取得
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1]; // "Bearer トークン" の形式
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY); // トークンを検証
    } catch (err) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // タグを作成し、存在する場合は取得

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
        userId: (decoded as jwt.JwtPayload).id, // トークンからユーザーIDを取得
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
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://enpit-2024-web2-five.vercel.app"
    );
    return response;
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
