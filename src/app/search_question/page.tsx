"use client"; // クライアントコンポーネントとして使用

import React, { useState, useEffect } from 'react';
import styles from './page.module.css'; // スタイルファイルのインポート
import TagSelector from '@/components/TagSelector'; // タグ選択コンポーネントのインポート

type Tag = {
  id: number;
  name: string;
};

type Question = {
  id: number;
  title: string;
  tags: Tag[];
};

const SearchPage: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null); // 解決済/未解決の選択
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]); // 選択されたタグ
  const [allQuestions, setAllQuestions] = useState<Question[]>([]); // すべての質問
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]); // フィルタリングされた質問

  // 初期データ取得（仮のデータとしてハードコード）
  useEffect(() => {
    // この部分でAPIから質問データを取得する処理を実装可能
    setAllQuestions([
      { id: 1, title: '質問1', tags: [{ id: 1, name: 'タグA' }, { id: 2, name: 'タグB' }] },
      { id: 2, title: '質問2', tags: [{ id: 1, name: 'タグA' }] },
      { id: 3, title: '質問3', tags: [{ id: 3, name: 'タグC' }] },
      { id: 4, title: '質問4', tags: [{ id: 2, name: 'タグB' }] },
    ]);
  }, []);

  // タグやステータスに基づいて質問をフィルタリング
  useEffect(() => {
    let filtered = allQuestions;

    // ステータスでフィルタリング（解決済/未解決）
    if (status) {
      // 実際のデータに解決済ステータスがあればここでフィルタリング
      // 現在はサンプルデータでステータスがないためスキップ
    }

    // タグでフィルタリング
    if (selectedTags.length > 0) {
      filtered = filtered.filter((question) =>
        selectedTags.every((tag) => question.tags.some((qTag) => qTag.id === tag.id))
      );
    }

    setFilteredQuestions(filtered);
  }, [status, selectedTags, allQuestions]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>OS課題相談広場</h1>
      <div className={styles.searchContainer}>
        <textarea
          placeholder="キーワードを入力してください（任意）"
          className={styles.textarea}
        />

        {/* タグ選択コンポーネント */}
        <TagSelector
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          isProcessing={false}
          setIsProcessing={() => {}} // 必要な場合処理フラグを管理
        />

        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="status"
              value="resolved"
              checked={status === 'resolved'}
              onChange={() => setStatus('resolved')}
            /> 解決済
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="status"
              value="unresolved"
              checked={status === 'unresolved'}
              onChange={() => setStatus('unresolved')}
            /> 未解決
          </label>
        </div>

        <button
          className={styles.button}
          onClick={() => console.log('検索ボタンがクリックされました')}
        >
          検索する
        </button>
      </div>

      {/* 質問リストの表示 */}
      <div className={styles.questionList}>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <div key={question.id} className={styles.questionItem}>
              {question.title}
            </div>
          ))
        ) : (
          <p>条件に一致する質問が見つかりませんでした。</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
