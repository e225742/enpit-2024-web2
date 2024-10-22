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

type HomeProps = {
  questions: Question[]; // サーバーサイドから渡される質問データの型
};

// SSRでデータを取得して表示するページコンポーネント
const Home = ({ questions }: HomeProps) => {
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

// サーバーサイドレンダリングで質問データを取得する関数
export async function getServerSideProps() {
  // サーバー側でAPIリクエストを実行
  const res = await fetch('https://enpit-2024-web2-five.vercel.app/api/get-questions');
  const questions = await res.json();

  return {
    props: {
      questions, // 質問データをページコンポーネントに渡す
    },
  };
}

export default Home;
