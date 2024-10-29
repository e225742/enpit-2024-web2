import React from 'react';
import styles from './page.module.css';
import Header from '@/components/header/header';

type Question = {
  id: number;
  title: string;
  content: string;
};

// getServerSidePropsを使用してサーバーサイドでデータを取得
export async function getServerSideProps() {
  const res = await fetch('https://enpit-2024-web2-five.vercel.app/api/get-questions', {
    cache: 'no-store', // キャッシュを無効化して最新データを取得
  });

  if (!res.ok) {
    return {
      notFound: true,
    };
  }

  const questions: Question[] = await res.json();

  // propsとしてページコンポーネントに渡す
  return {
    props: {
      questions,
    },
  };
}

type Props = {
  questions: Question[];
};

const Home: React.FC<Props> = ({ questions }) => {
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
