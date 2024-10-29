"use client";
import React, { useState } from 'react';
import Link from 'next/link'; // Linkコンポーネントをインポート
import styles from '@/app/page.module.css';
import { marked } from 'marked'; // markedライブラリをインポート

type Question = {
  id: number;
  title: string;
  content: string;
};

type QuestionsTabProps = {
  questions: Question[];
  unresolvedQuestions: Question[]; // 未解決の質問を受け取るプロパティ
};

const QuestionsTab: React.FC<QuestionsTabProps> = ({ questions, unresolvedQuestions }) => {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>('tab1'); // タブの状態を管理

  // タブを切り替える関数
  const handleTabClick = (tab: 'tab1' | 'tab2') => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <p>タグ一覧</p>
        {/* タグのリスト（ダミー表示のまま） */}
        <p>タグ1</p>
        <p>タグ2</p>
        <p>タグ3</p>
      </aside>

      <main className={styles.main}>
        {/* タブナビゲーション */}
        <div className={styles.tabs}>
          {['tab1', 'tab2'].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? styles.activeTab : styles.inactiveTab}
              onClick={() => handleTabClick(tab as 'tab1' | 'tab2')}
            >
              {tab === 'tab1' ? '最新の質問' : '未解決の質問'}
            </button>
          ))}
        </div>

        {/* タブのコンテンツ */}
        <div className={styles.tabContent}>
          {activeTab === 'tab1' && (
            <div className={styles.question}>
              {questions.length > 0 ? (
                questions.map((question) => (
                  <div key={question.id} className={styles.questionItem}>
                    <h2>
                      <Link href={`/question/${question.id}`}>{question.title}</Link> {/* リンクを追加 */}
                    </h2>
                    <div
                      className={styles.markdownContent} // 追加したスタイルを適用
                      dangerouslySetInnerHTML={{ __html: marked(question.content) }}
                    />
                  </div>
                ))
              ) : (
                <p>質問はまだありません。</p>
              )}
            </div>
          )}

          {activeTab === 'tab2' && (
            <div className={styles.question}>
              {unresolvedQuestions.length > 0 ? (
                unresolvedQuestions.map((question) => (
                  <div key={question.id} className={styles.questionItem}>
                    <h2>
                      <Link href={`/question/${question.id}`}>{question.title}</Link> {/* リンクを追加 */}
                    </h2>
                    <div
                      className={styles.markdownContent} // 追加したスタイルを適用
                      dangerouslySetInnerHTML={{ __html: marked(question.content) }}
                    />
                  </div>
                ))
              ) : (
                <p>未解決の質問はありません。</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuestionsTab;
