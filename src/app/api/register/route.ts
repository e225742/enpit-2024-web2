// src/app/api/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY as string;

export async function POST(req: NextRequest) {
  const { email, password, nickname } = await req.json();

  // ユーザーの重複確認
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // パスワードのハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // ユーザー作成
  // nickname が undefined ならデータベースにはセットしない形にしたい場合は、
  // "nickname: nickname ?? undefined" のように書けます
  // (undefinedを渡すとDBにはNULLが入る)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nickname: nickname ?? undefined, 
      // nickname を省略してもOK
      // nickname があればその値、無ければ undefined → DBでは NULL
    },
  });

  // ユーザー登録後、JWT トークンを発行
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });

  return NextResponse.json({ message: "User registered", user, token });
}
