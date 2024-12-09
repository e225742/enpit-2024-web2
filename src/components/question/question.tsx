"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { marked } from 'marked';
import { Maximize2, Minimize2 } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Header from '@/components/header/header';
import styles from './question.module.css';

function QuestionContent({ question }: { question: any }) {
  const router = useRouter(); // useRouterフックを取得
  const [answerContent, setAnswerContent] = useState('');
  const [answers, setAnswers] = useState(question.answers);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/create-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: answerContent, questionId: question.id }),
      });
      setAnswerContent('');
    } catch (err) {
      console.error('Error creating answer:', err);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={`${styles.mainContent} ${isExpanded ? styles.shrinkContent : ''}`}>
        <h3>質問</h3>
        <div className={styles.question}>
          <div className={styles.questionHeader}>
            <h2>{question.title}</h2>
            <span className={styles.dateInfo}>
              投稿日時: {formatDate(question.createdAt)}
            </span>
          </div>
          {question.image && (
            <img
              src={question.image}
              alt="Question Image"
              className={styles.questionImage} // 必要に応じてCSSを追加
            />
          )}
          <div className={styles.content}>
            <div dangerouslySetInnerHTML={{ __html: marked(question.content) }} />
          </div>
        </div>

        <div className={styles.answers}>
          <h3>回答 ({answers.length}件)</h3>
          {answers.map((answer: any) => (
            <div key={answer.id} className={styles.answer}>
              <div className={styles.answerHeader}>
                <span className={styles.dateInfo}>
                  回答日時: {formatDate(answer.createdAt)}
                </span>
              </div>
              <div className={styles.content}>
                <div dangerouslySetInnerHTML={{ __html: marked(answer.content) }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.answerFormContainer} ${isExpanded ? styles.expanded : ''}`}>
        <div className={styles.expandToggle}>
          <button
            type="button"
            onClick={toggleExpand}
            className={styles.expandButton}
          >
            {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            {isExpanded ? '縮小' : '拡大'}
          </button>
        </div>
        
        <form className={styles.answerForm} onSubmit={handleAnswerSubmit}>
          <textarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="回答を入力してください"
            className={`${styles.answerTextarea} ${isExpanded ? styles.expandedTextarea : ''}`}
            rows={isExpanded ? 15 : 3}
          />
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>
              回答を投稿
            </button>
            <button
              type="button"
              className={styles.reloadButton}
            >
              リロード
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionContent;
