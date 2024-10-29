import { GetServerSideProps } from 'next';
import React from 'react';
import styles from '../app/page.module.css'; // CSSモジュールをインポート
import Header from '@/components/header/header'; // Headerコンポーネントをインポート

type Question = {
  id: number;
  title: string;
  content: string;
};

type HomePageProps = {
  questions: Question[];
};

const Home = ({ questions }: HomePageProps) => {
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

// getServerSidePropsを使用してサーバーサイドでデータを取得
export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('https://enpit-2024-web2-five.vercel.app/api/get-questions', {
    cache: 'no-store', // キャッシュを無効化して最新データを取得
  });

  if (!res.ok) {
    throw new Error('Failed to fetch questions');
  }

  const questions: Question[] = await res.json();

  return {
    props: {
      questions,
    },
  };
};

export default Home;
