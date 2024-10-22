// Import necessary React components and styles
import React from 'react';
import styles from './page.module.css';
import Header from '@/components/header/header'; // Headerコンポーネントをインポート

// 型定義：Questionデータの型
type Question = {
  id: number;
  title: string;
  content: string;
};

// 非同期関数を使用してサーバーサイドデータを取得
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
  const questions = await getQuestions(); // サーバーサイドでデータを取得

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

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <p>タグ一覧</p>
          {/* タグのリストはダミーで表示 */}
        </aside>

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
    </div>
  );
};

export default Home;
