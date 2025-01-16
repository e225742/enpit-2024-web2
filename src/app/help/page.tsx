import React from 'react';
import styles from './page.module.css';
import Header from '@/components/header/header';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HowToUsePage = () => {
  return (
    
    <div>
    <Header />
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>使い方</h1>
      </header>
      <section className={styles.content}>
        <h2 className={styles.sectionTitle}>質問の投稿</h2>
        <p className={styles.paragraph}>
        <li className={styles.listItem}>画面右上の「＋質問する」をクリック。</li>
        <li className={styles.listItem}>タイトルを入力する。（例：pythonの条件分岐について）</li>
        <li className={styles.listItem}>タグを選択する。文字を入力すると、既存のタグから予測が表示されます。表示された予測をクリックすると、質問ページに付与するタグが追加されます。新しいタグを作成したい場合は、入力後Enterキーを2回押してください。</li>
        <li className={styles.listItem}>質問したい内容を記載する。マークダウン形式で入力することができます。</li>
        <li className={styles.listItem}>質問を投稿するにはログインする必要があります。</li>
        </p>

        <h2 className={styles.sectionTitle}>質問検索</h2>
        <p className={styles.paragraph}>
        <li className={styles.listItem}>画面右上の「質問検索」をクリック</li>
        <li className={styles.listItem}>キーワードを入力すると、タイトル・コンテンツ・回答のどれかに一致する文字が含まれている質問ページが検索されます。</li>
        <li className={styles.listItem}>タグを選択すると、一致するタグが付与された質問ページが検索されます。複数選択した場合、1つ以上当てはまる質問ページが検索されます。</li>
        <li className={styles.listItem}>解決済の質問と、未解決の質問を選択して検索できます。</li>
        </p>

        <h2 className={styles.sectionTitle}>質問に回答する</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>トップページや、質問検索で表示された質問のタイトルをクリックすることで、個別の質問ページに移動します。</li>
          <li className={styles.listItem}>画面下部の回答入力欄にマークダウン形式で入力し「回答を投稿」をクリックすることで、質問に回答することができます。</li>
        </ul>

        <h2 className={styles.sectionTitle}>自分が投稿した質問について</h2>
        <p className={styles.paragraph}>
        <li className={styles.listItem}>画面右上の「自分の質問」をクリックすることで、自分が投稿した質問一覧を確認できます。</li>
        <li className={styles.listItem}>質問について解決した場合、個別の質問ページの「解決済みにする」をクリックし、質問ページを「解決済」にしてください。</li>
        </p>
      </section>
      <footer className={styles.footer}>
      </footer>
    </div>
    </div>
  );
};

export default HowToUsePage;
