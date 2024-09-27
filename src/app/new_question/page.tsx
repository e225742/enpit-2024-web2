"use client" ;
import React, { useState, useEffect } from 'react';
import styles from './page.module.css'; 
import { useRouter } from 'next/router';
import Link from 'next/link';

const NewQuestionPage = () => {
  // const [isMounted, setIsMounted] = useState(false);
  // const router = useRouter();
  
  // useEffect(() => {
  //   setIsMounted(true); // コンポーネントがマウントされたことを確認
  // }, []);
  
  // const handleCancel = () => {
  //   if (isMounted) {
  //     router.push('/'); // キャンセル時にトップページに戻る
  //   }
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (isMounted) {
  //     console.log('フォーム送信');
  //     router.push('/'); // 質問送信後トップページに戻る
  //   }
  // };

  return (
    <div className={styles.container}>
      <h1>OS課題相談広場</h1>
      {/* <form onSubmit={handleSubmit}> */}
      <form >
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="タイトルを入力してください"
            // value={title}
            // onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="タグを選択してください"
            // value={tag}
            // onChange={(e) => setTag(e.target.value)}
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
            // value={content}
            // onChange={(e) => setContent(e.target.value)}
            placeholder="質問内容を入力してください"
            rows={10}
            className={styles.textArea}
          />
        </div>
        <div className={styles.footer}>
          {/* <button type="button" onClick={handleCancel} className={styles.cancelButton}>キャンセル</button> */}
          <Link href="/">
            <button type="button"  className={styles.cancelButton}>キャンセル</button>
          </Link>
          
          <button type="submit" className={styles.submitButton}>作成</button>
        </div>
      </form>
    </div>
  );
};

export default NewQuestionPage;
