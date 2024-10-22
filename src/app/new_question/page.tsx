"use client";  // これを追加することでクライアントコンポーネントとして扱われる

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // next/navigationを使用してリダイレクト
import styles from './page.module.css';

const NewQuestionPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter(); // ルーターをインスタンス化

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/create-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      // 質問作成後、トップページにリダイレクト
      router.push('/');
    } else {
      console.error('質問の作成に失敗しました');
    }
  };

  return (
    <div className={styles.container}>
      <h1>質問作成ページ</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="タイトルを入力してください"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.textAreaContainer}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="質問内容を入力してください"
            rows={10}
            className={styles.textArea}
          />
        </div>
        <button type="submit" className={styles.submitButton}>作成</button>
      </form>
    </div>
  );
};

export default NewQuestionPage;
