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

// ▼ 追加: 回答数トップのユーザーを取得する関数
async function fetchTopAnswerUsers() {
  // _count で answers の数を取得 & ソートしてTOP5を取得する
  return prisma.user.findMany({
    select: {
      id: true,
      nickname: true,          // 任意で登録されたニックネーム
      _count: {
        select: { answers: true },
      },
    },
    orderBy: {
      answers: {
        _count: 'desc',
      },
    },
    take: 5,
  });
}

// サーバーサイドで最新の質問と未解決の質問を取得する関数
async function fetchLatestQuestions(): Promise<Question[]> {
  const questions = await prisma.question.findMany({
  // return prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { tags: true, images: true },
  });

  return formatQuestions(questions);
}

async function fetchUnresolvedQuestions(): Promise<Question[]> {
  const questions = await prisma.question.findMany({
    // return prisma.question.findMany({
    where: { isResolved: false },
    orderBy: { createdAt: 'desc' },
    include: { tags: true, images: true },
  });

  return formatQuestions(questions);
}

async function fetchTags(): Promise<Tag[]> {
  const tags = await prisma.tag.findMany({ 
    orderBy: { name: 'asc' } 
  });
  return tags;
}

export default async function Home() {
  const tags = await fetchTags();                // タグ一覧を取得
  const latestQuestions = await fetchLatestQuestions();
  const unresolvedQuestions = await fetchUnresolvedQuestions();

  // ▼ 追加: 「回答数が多いユーザー」を取得
  const topUsers = await fetchTopAnswerUsers();

  return (
    <div>
      <Header />
      <div className={styles.introSection}>
        {/* 左側: メッセージ */}
        <div className={styles.introLeft}>
          <h2>相談広場へようこそ！</h2>
          <p>
            課題について質問をたくさん聞いてね〜 <br />
            匿名で授業や課題について分からないことを質問できるよ！ <br />
            学サポのTAや友人が答えてくれるよ！！
          </p>
        </div>

        {/* 右側: 回答数TOP5ランキング */}
        <div className={styles.introRight}>
          <h3>回答数が多いユーザー TOP5</h3>
          {topUsers.length === 0 ? (
            <p>まだ回答したユーザーはいません。</p>
          ) : (
            topUsers.map((user, index) => (
              <div key={user.id} className={styles.userRow}>
                <span className={styles.userNickname}>
                  {index === 0 && <span className={styles.crown}>👑 </span>}
                  {user.nickname ?? "名無し"}
                </span>
                <span className={styles.userAnswerCount}>
                  回答数：{user._count.answers}
                </span>
              </div>
            ))
          )}
        </div>

      </div>



      {/* タブコンポーネントにデータを渡す */}
      <QuestionsTab
        questions={latestQuestions}
        unresolvedQuestions={unresolvedQuestions}
        tags={tags}
      />
    </div>
  );
}

export const revalidate = 0;
