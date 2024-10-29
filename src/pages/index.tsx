import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import React from 'react';

const prisma = new PrismaClient();

type Question = {
  id: number;
  title: string;
  content: string;
};

type HomePageProps = {
  questions: Question[];
};

const Home = ({ questions }: HomePageProps) => {
  return (
    <div>
      <h1>最新の質問</h1>
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
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Prismaを使ってデータベースから最新の質問を取得
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return {
    props: {
      questions,
    },
  };
};

export default Home;
