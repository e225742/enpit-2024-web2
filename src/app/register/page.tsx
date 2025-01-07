"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ① ニックネーム用のステートを追加
  const [nickname, setNickname] = useState("");
  
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // ② リクエスト時に nickname を含める
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nickname }),
    });

    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      router.push("/");
    } else {
      alert(data.error || "登録に失敗しました。");
    }
  };

  return (
    <div className={styles.pageRoot}>
      <div className={styles["auth-container"]}>
        <h1>新規ユーザー登録</h1>
        <p>アカウントを作成し、サービスを利用しましょう。</p>
        <form onSubmit={handleRegister}>
          {/* ③ ニックネームの入力欄を追加（任意なので required は指定しない） */}
          <input
            type="text"
            name="nickname"
            placeholder="ニックネーム（任意）"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
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
          <button className={styles["link-button"]} type="button">
            既にアカウントをお持ちですか？ログイン
          </button>
        </Link>
      </div>
    </div>
  );
}
