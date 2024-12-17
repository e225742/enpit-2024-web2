"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.message) {
      // 登録成功時にログインを行う
      const loginRes = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok && loginData.token) {
        localStorage.setItem("token", loginData.token);
        alert("登録 & ログインに成功しました！");
        router.push("/");
      } else {
        alert(loginData.error || "登録は成功しましたが、ログインに失敗しました。");
      }
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
        <button className={styles["link-button"]} type="button">
          既にアカウントをお持ちですか？ログイン
        </button>
      </Link>
    </div>
  );
}
