import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // リダイレクト用
import styles from './page.module.css';

const NewQuestionPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

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
      router.push('/'); // 質問作成後、トップページへリダイレクト
    } else {
      console.error('質問の作成に失敗しました');
    }
  };

  return (
    <div className={styles.container}>
      <h1>質問を作成</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="質問内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">作成</button>
      </form>
    </div>
  );
};

export default NewQuestionPage;
