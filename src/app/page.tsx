import React from 'react';
import styles from './page.module.css';
import Header from '@/components/header/header';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Question = {
  id: number;
  title: string;
  content: string;
};

async function fetchQuestions(): Promise<Question[]> {
  // データベースから最新の質問を取得
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return questions;
}

export default async function Home() {
  // 最新のデータを常に取得するようにキャッシュ設定を無効化
  const questions = await fetchQuestions();

  return (
    <div>
      <Header />

      <div className={styles.introSection}>
        <h2>相談広場へようこそ！</h2>
      </div>

      <main className={styles.main}>
        <h2>最新の質問</h2>
        <div className={styles.questionList}>
          {questions.map((question) => (
            <div key={question.id} className={styles.questionItem}>
              <h3>{question.title}</h3>
              <p>{question.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export const revalidate = 0; // ISRのキャッシュを無効化して最新のデータを取得
