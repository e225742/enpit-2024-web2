"use client"; // クライアントコンポーネントとして使用

import React, { useState } from 'react';
import styles from './page.module.css'; // スタイルファイルのインポート

const SearchPage: React.FC = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [questions, setQuestions] = useState<string[]>([
        '検索された質問1',
        '検索された質問2',
        '検索された質問3',
        '検索された質問4',
        '検索された質問5',
        '検索された質問6',
    ]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>OS課題相談広場</h1>
            <div className={styles.searchContainer}>
                <textarea
                    placeholder="キーワードを入力してください（任意）"
                    className={styles.textarea}
                />
                <textarea
                    placeholder="タグを選択してください（任意）"
                    className={styles.textarea}
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

                <button className={styles.button}>検索する</button>
            </div>

            <div className={styles.questionList}>
                {questions.map((question, index) => (
                    <div key={index} className={styles.questionItem}>
                        {question}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;
