"use client";
import React, { useState } from 'react';
import styles from './page.module.css'; 
import Link from 'next/link';
import { marked } from 'marked'; // markedライブラリをインポート
import { useRouter } from 'next/navigation';  // next/routerを使ってページ遷移を行う

const NewQuestionPage = () => {
  const [title, setTitle] = useState(''); // タイトルを管理するステート
  const [tag, setTag] = useState(''); // タグを管理するステート
  const [content, setContent] = useState(''); // 入力内容を管理するステート
  const router = useRouter(); // ページ遷移用

  // 質問を作成する関数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ

    const res = await fetch('/api/create-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        tag,
      }), // タイトルと内容を送信
    });

    if (res.ok) {
      router.push('/'); // 成功したらトップページへリダイレクト
    } else {
      console.error('質問の作成に失敗しました');
    }
  };

  return (
    <div className={styles.container}>
      <h1>OS課題相談広場</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // タイトルを更新
            placeholder="タイトルを入力してください"
            className={styles.input}
            required // 必須入力
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)} // タグを更新
            placeholder="タグを選択してください"
            className={styles.input}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button type="button" className={styles.imageButton}>画像添付</button>
          <button type="button" className={styles.editButton}>エディタ</button>
          <button type="button" className={styles.previewButton}>プレビュー</button>
        </div>
        <div className={styles.textAreaContainer}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)} // 内容を更新
            placeholder="Markdown形式で質問内容を入力してください"
            rows={10}
            className={styles.textArea}
            required // 必須入力
          />
          <div
            className={styles.previewArea}
            dangerouslySetInnerHTML={{ __html: marked(content) }} // MarkdownをHTMLに変換してプレビュー表示
          />
        </div>
        <div className={styles.footer}>
          <Link href="/">
            <button type="button" className={styles.cancelButton}>キャンセル</button>
          </Link>
          <button type="submit" className={styles.submitButton}>作成</button>
        </div>
      </form>
    </div>
  );
};

export default NewQuestionPage;
