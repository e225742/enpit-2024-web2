"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import TagSelector from "@/components/TagSelector";

type Tag = {
  id: number;
  name: string;
};

type Question = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isResolved: boolean;
  tags: Tag[];
};

const SearchPage: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
  
      // タグをクエリパラメータに追加
      if (selectedTags.length > 0) {
        queryParams.set(
          'tag',
          selectedTags.map((tag) => tag.name).join(',')
        );
      }
  
      const res = await fetch(`/api/get-questions?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch questions');
      }
  
      const data = await res.json();
      setQuestions(data); // 取得した質問データをセット
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>OS課題相談広場</h1>
      <div className={styles.searchContainer}>
        <textarea
          placeholder="キーワードを入力してください（任意）"
          className={styles.textarea}
          disabled={loading}
        />

        <TagSelector
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          isProcessing={loading}
          allowTagCreation={false} // タグ作成を無効化
        />

        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="status"
              value="resolved"
              checked={status === "resolved"}
              onChange={() => setStatus("resolved")}
              disabled={loading}
            />
            解決済
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="status"
              value="unresolved"
              checked={status === "unresolved"}
              onChange={() => setStatus("unresolved")}
              disabled={loading}
            />
            未解決
          </label>
        </div>

        <button className={styles.button} onClick={fetchQuestions} disabled={loading}>
          {loading ? "質問検索中..." : "検索する"}
        </button>
      </div>

      <div className={styles.questionList}>
        {questions.length > 0 ? (
          questions.map((question) => (
            <div key={question.id} className={styles.questionItem}>
              <h3>{question.title}</h3>
              <p>{question.content}</p>
              <p>
                <strong>タグ:</strong>{" "}
                {question.tags.map((tag) => tag.name).join(", ")}
              </p>
              <p>
                <strong>ステータス:</strong>{" "}
                {question.isResolved ? "解決済" : "未解決"}
              </p>
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
