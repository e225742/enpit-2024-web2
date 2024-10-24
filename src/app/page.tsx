import React from 'react';
import styles from './page.module.css';
import Header from '@/components/header/header';

type Question = {
  id: number;
  title: string;
  content: string;
};

// ISRを使ったデータ取得
export async function getStaticProps() {
  const res = await fetch('https://enpit-2024-web2-five.vercel.app/api/get-questions');
  const questions = await res.json();

  return {
    props: {
      questions,
    },
    // ページを10秒ごとに再生成する設定
    revalidate: 10, // 10秒ごとにページが再生成され、データが更新される
  };
}

export default function Home({ questions }: { questions: Question[] }) {
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
