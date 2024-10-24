"use client"; 
import React, { useState, useEffect } from 'react';

type Question = {
  id: number;
  title: string;
  content: string;
};

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/get-questions', {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }

        const data = await res.json();
        setQuestions(data);
      } catch (err: any) {
        // エラーメッセージを設定
        setError(err.message || 'Unknown error occurred');
        console.error('Error fetching questions:', err.message || err);
      }
    };

    fetchQuestions();
  }, []);

  if (error) {
    return <div>エラーが発生しました: {error}</div>;
  }

  return (
    <div>
      <h2>最新の質問</h2>
      <div>
        {questions.map((question) => (
          <div key={question.id}>
            <h3>{question.title}</h3>
            <p>{question.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
