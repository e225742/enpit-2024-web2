// src/components/question/question.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styles from './question.module.css';
import { marked } from 'marked';
import Header from '@/components/header/header';

function QuestionContent({ question }: { question: any }) {
  const [answerContent, setAnswerContent] = useState('');
  const [answers, setAnswers] = useState(question.answers);

  const fetchAnswers = async () => {
    const res = await fetch(`/api/questions/${question.id}/answers`);
    const data = await res.json();
    setAnswers(data);
  };

  useEffect(() => {
    fetchAnswers();
  }, [question.id]);

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/create-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: answerContent, questionId: question.id }),
      });
      const newAnswer = await res.json();
      setAnswers((prevAnswers: any) => [...prevAnswers, newAnswer]);
      setAnswerContent('');
    } catch (err) {
      console.error('Error creating answer:', err);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <p>タグ一覧</p>
          {1.1}<br />
          {1.2}<br />
          {1.3}<br />
        </aside>

        <main className={styles.main}>
          <div className={styles.questionSection}>
            <h1 className={styles.questionTitle}>{question.title}</h1>
            <div 
              className={styles.markdownContent}
              dangerouslySetInnerHTML={{ __html: marked(question.content) }}
            />
          </div>

          <div className={styles.answerSection}>
            <h2 className={styles.answerTitle}>回答</h2>
            <form onSubmit={handleAnswerSubmit} className={styles.answerForm}>
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="回答を入力してください"
                rows={4}
                className={styles.answerTextarea}
              />
              <div className={styles.buttonContainer}>
                <button type="submit" className={styles.submitButton}>回答を投稿</button>
                <button 
                  type="button" 
                  onClick={fetchAnswers}
                  className={styles.reloadButton}
                >
                  リロード
                </button>
              </div>
            </form>

            <div className={styles.answersContainer}>
              <h3 className={styles.existingAnswersTitle}>既存の回答</h3>
              {answers.map((answer: any) => (
                <div key={answer.id} className={styles.answerItem}>
                  <div
                    className={styles.markdownContent}
                    dangerouslySetInnerHTML={{ __html: marked(answer.content) }}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default QuestionContent;