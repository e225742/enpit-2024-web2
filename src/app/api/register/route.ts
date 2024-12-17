// src/app/api/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY as string;

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  // ユーザー登録後、JWTトークンを発行
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

  return NextResponse.json({ message: "User registered", user, token });
}
