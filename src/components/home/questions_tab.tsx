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
  image: string;
};

type Tag = {
  id: number;
  name: string
}

type QuestionsTabProps = {
  questions: Question[];
  unresolvedQuestions: Question[];
  tags: Tag[];
};

enum Tab {
  LatestQuestions = 'latest',
  UnresolvedQuestions = 'unresolved',
}

const QuestionsTab: React.FC<QuestionsTabProps> = ({ questions, unresolvedQuestions, tags }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.LatestQuestions);

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
            {question.image && (
              <img
                src={question.image}
                alt="Question Image"
                className={styles.questionImage} // 必要に応じてCSSを追加
              />
            )}
            <div
              className={styles.markdownContent}
              dangerouslySetInnerHTML={{ __html: marked(question.content) }}
            />
          </div>
        ))
      ) : (
        <p>{activeTab === Tab.LatestQuestions ? '質問はまだありません。' : '未解決の質問はありません。'}</p>
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
              {tag.name}<br />
            </div>
          ))
        ) : (
          <p>タグがありません</p>
        )}
      </aside>

      <main className={styles.main}>
        <div className={styles.tabs}>
          <button
            className={activeTab === Tab.LatestQuestions ? styles.activeTab : styles.inactiveTab}
            onClick={() => handleTabClick(Tab.LatestQuestions)}
          >
            最新の質問
          </button>
          <button
            className={activeTab === Tab.UnresolvedQuestions ? styles.activeTab : styles.inactiveTab}
            onClick={() => handleTabClick(Tab.UnresolvedQuestions)}
          >
            未解決の質問
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === Tab.LatestQuestions && renderQuestions(questions)}
          {activeTab === Tab.UnresolvedQuestions && renderQuestions(unresolvedQuestions)}
        </div>
      </main>
    </div>
  );
};

export default QuestionsTab;
