// app/question/[id]/QuestionContent.tsx
"use client"; // クライアントコンポーネントとしてマーク

import React, { useState } from 'react';

function QuestionContent({ question }: { question: any }) {
  const [answerContent, setAnswerContent] = useState('');

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/create-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: answerContent, questionId: question.id }),
      });
      setAnswerContent(''); // 入力内容をリセット
      // ここで再フェッチして画面を更新する処理を追加することも考えられます
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

      <div>
        <h3>既存の回答</h3>
        {question.answers.map((answer: any) => (
          <div key={answer.id}>
            <p>{answer.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionContent;
