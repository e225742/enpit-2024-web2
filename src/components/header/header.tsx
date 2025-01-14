"use client";
import { useState, useEffect } from "react";
import styles from "./header.module.css";
import Link from "next/link";
import Head from "next/head";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ログイン状態の確認
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className={styles.header}>
      <Head>
        <title>課題相談広場</title>
      </Head>
      <div className={styles.left}>
        <h1>
          <Link href="/" className={styles.link}>
            課題相談広場
          </Link>
        </h1>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/search_question">
              <button className={styles.questionButton}>質問検索</button>
            </Link>
          </li>
          <li>
            <Link href="/help">
              <button className={styles.questionButton}>使い方</button>
            </Link>
          </li>

          {/* ログインしている場合 */}
          {isLoggedIn ? (
            <>
              <li>
                <Link href="/user_questions">
                  <button className={styles.questionButton}>自分の質問</button>
                </Link>
              </li>
              <li>
                <Link href="/new_question">
                  <button className={styles.questionButton}>＋質問する</button>
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  ログアウト
                </button>
              </li>
            </>
          ) : (
            // ログインしていない場合
            <>
              <li>
                <Link href="/login">
                  <button className={styles.loginButton}>ログイン</button>
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <button className={styles.registerButton}>新規登録</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
