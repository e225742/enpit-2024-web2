"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.message) {
      alert("Registration successful!");
      // ログインページへ遷移などの処理
    } else {
      alert(data.error);
    }
  };

  return (
    <div className={styles["auth-container"]}>
      <h1>新規ユーザー登録</h1>
      <p>アカウントを作成し、サービスを利用しましょう。</p>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          name="email"
          autoComplete="username"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="パスワード（8文字以上）"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">登録</button>
      </form>
      <Link href="/login">
        <button className="link-button" type="button">
          既にアカウントをお持ちですか？ログイン
        </button>
      </Link>
    </div>
  );
}
