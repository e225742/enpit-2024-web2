import React from 'react';
import styles from './page.module.css';
import Header from '@/components/header/header';
import { PrismaClient } from '@prisma/client';
import QuestionsTab from '@/components/QuestionsTab';

const prisma = new PrismaClient();

type Question = {
  id: number;
  title: string;
  content: string;
};

// サーバーサイドでデータを取得する関数
async function fetchQuestions(): Promise<Question[]> {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return questions;
}

// サーバーコンポーネント
export default async function Home() {
  const questions = await fetchQuestions();

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

      <QuestionsTab questions={questions} />
    </div>
  );
}

export const revalidate = 0; // ISRのキャッシュを無効化して最新のデータを取得
