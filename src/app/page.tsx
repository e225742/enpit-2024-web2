import React from 'react';
import styles from './page.module.css';
import Header from '@/components/header/header';

type Question = {
  id: number;
  title: string;
  content: string;
};

// 非同期関数を使用してサーバーサイドデータを取得
async function getQuestions(): Promise<Question[]> {
  try {
    const res = await fetch('https://enpit-2024-web2-five.vercel.app/api/get-questions', {
      cache: 'no-store', // キャッシュを無視して常に最新のデータを取得
    });
    
    // エラーチェック
    if (!res.ok) {
      throw new Error(`Error fetching questions: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

const Home = async () => {
  try {
    const questions = await getQuestions(); // サーバーサイドでデータを取得

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
  } catch (error) {
    return <div>データを取得できませんでした。</div>;
  }
};

export default Home;
