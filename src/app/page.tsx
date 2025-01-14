import React from 'react';
import styles from './page.module.css';
import Header from '@/components/header/header';
import { PrismaClient } from '@prisma/client';
import QuestionsTab from '@/components/home/questions_tab';

const prisma = new PrismaClient();

type Tag = { 
  id: number; 
  name: string 
};

type Image = {
  id: number;
  questionId: number;
  binaryData: string; // Base64形式
  createdAt: Date;
};

type Question = {
  id: number;
  title: string;
  content: string;
  isResolved: boolean;
  createdAt: Date;
  tags: Tag[];
  images: Image[];
};

// Prismaから取得したデータをBase64形式にフォーマット
const formatQuestions = (questions: any[]): Question[] => {
  return questions.map((question) => ({
    ...question,
    images: question.images.map((image: Image) => ({
      ...image,
      binaryData: Buffer.from(image.binaryData).toString('base64'), // Base64形式として変換
    })),
  }));
};

async function fetchLatestQuestions(): Promise<Question[]> {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { tags: true, images: true },
  });

  return formatQuestions(questions);
}

async function fetchUnresolvedQuestions(): Promise<Question[]> {
  const questions = await prisma.question.findMany({
    where: { isResolved: false },
    orderBy: { createdAt: 'desc' },
    include: { tags: true, images: true },
  });

  return formatQuestions(questions);
}

async function fetchTags(): Promise<Tag[]> {
  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
  return tags;
}

export default async function Home() {
  const tags = await fetchTags();
  const latestQuestions = await fetchLatestQuestions();
  const unresolvedQuestions = await fetchUnresolvedQuestions();

  return (
    <div>
      <Header />
      <div className={styles.introSection}>
        <h2>相談広場へようこそ！</h2>
        <p>
          OSの課題について質問をたくさん聞いてね〜 <br />
          匿名で授業や課題について分からないことを質問できるよ！ <br />
          学サポのTAや友人が答えてくれるよ！！
        </p>
      </div>
      <QuestionsTab questions={latestQuestions} unresolvedQuestions={unresolvedQuestions} tags={tags} />
    </div>
  );
}

export const revalidate = 0;
