"use client";  // クライアントサイドで動作するコンポーネントであることを明示

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Header from '@/components/header/header';

type Question = {
  id: number;
  title: string;
  content: string;
};

const Home = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('https://enpit-2024-web2-five.vercel.app/api/get-questions', {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }

        const data = await res.json();
        setQuestions(data);
      } catch (err: any) {
        console.error('Error fetching questions:', err);
      }
    };

    fetchQuestions();
  }, []);

  if (error) {
    return <div>エラーが発生しました: {error}</div>;
  }

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
};

export default Home;
