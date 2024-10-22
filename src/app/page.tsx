"use client";

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Header from '@/components/header/header'; // Headerコンポーネントをインポート

//できるかなあ
// 質問データの型定義
type Question = {
  id: number;
  title: string;
  content: string;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('tab1'); // タブの状態を管理
  const [questions, setQuestions] = useState<Question[]>([]); // 質問データを管理

  // データベースから質問を取得するためのuseEffect
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/get-questions');
        if (!res.ok) {
          throw new Error(`Failed to fetch questions. Status: ${res.status}`);
        }
        const data = await res.json();
        setQuestions(data); // 最新の質問をステートに保存
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
  
    fetchQuestions();
  }, []);

  // タブを切り替える関数
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

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
          {/* タグのリスト（ダミー表示のまま） */}
        </aside>

        <main className={styles.main}>
          {/* タブナビゲーション */}
          <div className={styles.tabs}>
            <button
              className={`${activeTab === 'tab1' ? styles.activeTab1 : styles.inactiveTab}`}
              onClick={() => handleTabClick('tab1')}
            >
              最新の質問
            </button>
            <button
              className={`${activeTab === 'tab2' ? styles.activeTab2 : styles.inactiveTab}`}
              onClick={() => handleTabClick('tab2')}
            >
              未解決の質問
            </button>
          </div>

          {/* タブのコンテンツ */}
          <div className={styles.tabContent}>
            {activeTab === 'tab1' && (
              <div className={styles.questionList}>
                {questions.map((question) => (
                  <div key={question.id} className={styles.questionItem}>
                    <h2>{question.title}</h2>
                    <p>{question.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
