import React from 'react';
import styles from './page.module.css';
import Header from '@/components/header/header';
import { PrismaClient } from '@prisma/client';
import QuestionsTab from '@/components/home/questions_tab';

const prisma = new PrismaClient();

type Question = {
  id: number;
  title: string;
  content: string;
  isResolved: boolean;
  createdAt: Date;
};

type Tag = {
  id: number;
  name: string;
};

// サーバーサイドで最新の質問と未解決の質問を取得する関数
async function fetchLatestQuestions(): Promise<Question[]> {
  return await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10, // 必要に応じて最新10件だけ取得するなど制限可能
  });
}

async function fetchUnresolvedQuestions(): Promise<Question[]> {
  return await prisma.question.findMany({
    where: { isResolved: false },
    orderBy: { createdAt: 'desc' },
  });
}

// サーバーサイドでタグを取得する関数
async function fetchTags(): Promise<Tag[]> {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  });
  return tags;
}

// サーバーコンポーネント
export default async function Home() {
  const tags = await fetchTags(); // タグ一覧を取得
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

      {/* タブコンポーネントにデータを渡す */}
      <QuestionsTab questions={latestQuestions} unresolvedQuestions={unresolvedQuestions} tags={tags} />
    </div>
  );
}

export const revalidate = 0; // キャッシュを無効化して常に最新のデータを取得
