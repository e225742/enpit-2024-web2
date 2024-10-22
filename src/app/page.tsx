"use client";

import React from 'react';
import useSWR from 'swr';
import styles from './page.module.css';
import Header from '@/components/header/header';

// データ取得用の関数
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  // SWRを使用してデータを取得
  const { data: questions, error } = useSWR('https://enpit-2024-web2-five.vercel.app/api/get-questions', fetcher, {
    refreshInterval: 5000, // 5秒ごとに自動でデータを更新
  });

  if (error) return <div>エラーが発生しました: {error.message}</div>;
  if (!questions) return <div>読み込み中...</div>;

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

      <main className={styles.main}>
        <h2>最新の質問</h2>
        <div className={styles.questionList}>
          {questions.map((question: { id: number, title: string, content: string }) => (
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
