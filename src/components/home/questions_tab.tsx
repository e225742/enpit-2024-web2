"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/page.module.css';
import { marked } from 'marked';

type Question = {
  id: number;
  title: string;
  content: string;
  isResolved: boolean;
};

type Tag = {
  id: number;
  name: string;
};

type QuestionsTabProps = {
  questions: Question[];
  unresolvedQuestions: Question[];
  tags: Tag[];
};

// タブの状態を表す文字列リテラル型を定義
type Tab = 'latest' | 'unresolved';

const QuestionsTab: React.FC<QuestionsTabProps> = ({ questions, unresolvedQuestions, tags }) => {
  const [activeTab, setActiveTab] = useState<Tab>('latest'); // デフォルトで 'latest' を選択

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };

  const renderQuestions = (questions: Question[]) => (
    <div className={styles.question}>
      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question.id} className={styles.questionItem}>
            <h2>
              <Link href={`/question/${question.id}`}>{question.title}</Link>
            </h2>
            <div
              className={styles.markdownContent}
              dangerouslySetInnerHTML={{ __html: marked(question.content) }}
            />
          </div>
        ))
      ) : (
        <p>{activeTab === 'latest' ? '質問はまだありません。' : '未解決の質問はありません。'}</p>
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <p>タグ一覧</p>
        {tags.length > 0 ? (
          tags.map((tag) => (
            <div key={tag.id}>
              {tag.name}
              <br />
            </div>
          ))
        ) : (
          <p>タグがありません</p>
        )}
      </aside>

      <main className={styles.main}>
        <div className={styles.tabs}>
          <button
            className={activeTab === 'latest' ? styles.activeTab : styles.inactiveTab}
            onClick={() => handleTabClick('latest')}
          >
            最新の質問
          </button>
          <button
            className={activeTab === 'unresolved' ? styles.activeTab : styles.inactiveTab}
            onClick={() => handleTabClick('unresolved')}
          >
            未解決の質問
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'latest' && renderQuestions(questions)}
          {activeTab === 'unresolved' && renderQuestions(unresolvedQuestions)}
        </div>
      </main>
    </div>
  );
};

export default QuestionsTab;
