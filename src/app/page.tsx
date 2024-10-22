import React from 'react';
import styles from './page.module.css';
import Header from '@/components/header/header';

type Question = {
  id: number;
  title: string;
  content: string;
};

async function getQuestions(): Promise<Question[]> {
  const res = await fetch('https://enpit-2024-web2-five.vercel.app/api/get-questions', {
    cache: 'no-store', // キャッシュを無視して常に最新のデータを取得
  });
  if (!res.ok) {
    throw new Error('Failed to fetch questions');
  }
  return res.json();
}

const Home = async () => {
  const questions = await getQuestions();

  return (
    <div>
      <Header />
      <div className={styles.introSection}>
        <h2>相談広場へようこそ！</h2>
        <p>匿名で授業や課題について分からないことを質問できるよ！</p>
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
