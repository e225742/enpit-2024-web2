"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import { marked } from "marked";
import TagSelector from "@/components/TagSelector";

type Tag = {
  id: number;
  name: string;
};

const NewQuestionPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);

  // 画像選択処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  // ファイルをBase64形式に変換
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // ログイン状態の確認
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // 未ログイン時はログインページにリダイレクト
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 空文字または空白のみの場合は投稿をキャンセル
    if (title.trim() === '' || content.trim() === '') {
      alert('タイトルと内容は必須です。入力してください。');
      return;
    }
  
    if (isSubmittingQuestion) return;
  
    setIsSubmittingQuestion(true);
    try {
      // 画像をBase64形式に変換
      const base64Images = await Promise.all(
        images.map((image) => convertToBase64(image))
      );
      const res = await fetch("/api/create-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // 認証ヘッダーにトークンを付与
        },
        body: JSON.stringify({
          title,
          content,
          tags: selectedTags.map((tag) => tag.name),
          images: base64Images.map((binaryData) => ({ binaryData })),
        }),
      });
  
      if (res.ok) {
        router.push("/");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "質問の作成に失敗しました。");
      }
    } catch (err) {
      console.error("Error creating question:", err);
      alert("エラーが発生しました。再度お試しください。");
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>課題相談広場</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="タイトルを入力してください"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            disabled={isSubmittingQuestion || isCreatingTag}
          />
        </div>
        <div className={styles.inputGroup}>
          <TagSelector
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}

            isProcessing={isCreatingTag}
            setIsProcessing={setIsCreatingTag}
          />
        </div>
        <div className={styles.buttonGroup}>
          <label className={styles.imageButton}>
            画像添付
            <input type="file" multiple onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
        </div>
        <div>
          {images.map((file, idx) => (
            <p key={idx}>{file.name}</p>
          ))}
        </div>
        <div className={styles.textAreaContainer}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Markdown形式で質問内容を入力してください"
            rows={10}
            className={styles.textArea}
            disabled={isSubmittingQuestion || isCreatingTag}
          />
          <div
            className={styles.previewArea}
            dangerouslySetInnerHTML={{ __html: marked(content) }}
          />
        </div>

        <div className={styles.footer}>
          <Link href="/">
            <button
              type="button"
              className={styles.cancelButton}
              disabled={isSubmittingQuestion || isCreatingTag}
            >
              キャンセル
            </button>
          </Link>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmittingQuestion || isCreatingTag}
          >
            {isSubmittingQuestion ? "作成中..." : "作成"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewQuestionPage;
