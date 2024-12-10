"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import { marked } from 'marked';
import TagSelector from '@/components/TagSelector';

type Tag = {
  id: number;
  name: string;
};

const NewQuestionPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false); // 質問作成中フラグ
  const [isCreatingTag, setIsCreatingTag] = useState(false); // タグ作成中フラグ
  const [image, setImage] = useState<string | null>(null); // 選択された画像のプレビューURL
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string); // Base64形式のデータを保存
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setIsSubmittingQuestion(true);
    try {
      const res = await fetch('/api/create-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tags: selectedTags.map((tag) => tag.name),
          image, // Base64形式の画像を送信
        }),
      });
  
      if (res.ok) {
        router.push('/');
      } else {
        console.error('Failed to create question');
      }
    } catch (err) {
      console.error('Error creating question:', err);
    } finally {
      setIsSubmittingQuestion(false);
    }
  };
  

  return (
    <div className={styles.container}>
      <h1>OS課題相談広場</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="タイトルを入力してください"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            disabled={isSubmittingQuestion || isCreatingTag} // 質問作成中またはタグ作成中は無効化
          />
        </div>
        <div className={styles.inputGroup}>
          <TagSelector 
            selectedTags={selectedTags} 
            setSelectedTags={setSelectedTags} 
            isProcessing={isCreatingTag} // タグ作成中フラグを渡す
            setIsProcessing={setIsCreatingTag} // タグ作成中フラグを更新
          />
        </div>
        <div className={styles.buttonGroup}>
          <label className={styles.imageButton}>
            画像添付
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }} // ボタンを隠す
              disabled={isSubmittingQuestion || isCreatingTag} // 質問作成中またはタグ作成中は無効化
            />
          </label>
          <button type="button" className={styles.editButton}>エディタ</button>
          <button type="button" className={styles.previewButton}>プレビュー</button>
        </div>
        <div className={styles.textAreaContainer}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)} // 入力内容をステートに反映
            placeholder="Markdown形式で質問内容を入力してください"
            rows={10}
            className={styles.textArea}
            disabled={isSubmittingQuestion || isCreatingTag} // 質問作成中またはタグ作成中は無効化
          />
          <div
            className={styles.previewArea}
            dangerouslySetInnerHTML={{ __html: marked(content) }} // MarkdownをHTMLに変換して表示
          />
        </div>

        {/* プレビュー画像 */}
        {image && (
          <div className={styles.imagePreview}>
            <img src={image} alt="Preview" />
          </div>
        )}
        
        <div className={styles.footer}>
          <Link href="/">
            <button type="button" className={styles.cancelButton} disabled={isSubmittingQuestion || isCreatingTag} >
              キャンセル</button>
          </Link>
          <button type="submit" className={styles.submitButton} disabled={isSubmittingQuestion || isCreatingTag} >
          {isSubmittingQuestion ? '作成中...' : '作成'}</button>
        </div>
      </form>
    </div>
  );
};

export default NewQuestionPage;
