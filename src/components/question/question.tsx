// src/components/question/question.tsx
"use client"; // クライアントコンポーネントとしてマーク

import React, { useState, useEffect } from 'react';

function QuestionContent({ question }: { question: any }) {
  const [answerContent, setAnswerContent] = useState('');
  const [answers, setAnswers] = useState(question.answers);

  // 再フェッチ関数
  const fetchAnswers = async () => {
    const res = await fetch(`/api/questions/${question.id}/answers`);
    const data = await res.json();
    setAnswers(data);
  };

  // コンポーネントがマウントされたときに初期の回答を取得
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
    <div>
      <h1>{question.title}</h1>
      <p>{question.content}</p>

      <h2>回答</h2>
      <form onSubmit={handleAnswerSubmit}>
        <textarea
          value={answerContent}
          onChange={(e) => setAnswerContent(e.target.value)}
          placeholder="回答を入力してください"
          rows={4}
        />
        <button type="submit">回答を投稿</button>
      </form>

      <button onClick={fetchAnswers}>リロード</button> {/* リロードボタン追加 */}

      <div>
        <h3>既存の回答</h3>
        {answers.map((answer: any) => (
          <div key={answer.id}>
            <p>{answer.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionContent;
