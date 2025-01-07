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
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  

  // 画像選択処理
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  // 画像アップロード処理
  const uploadImages = async () => {
    const urls: string[] = [];
    for (const image of images) {
      const formData = new FormData();
      formData.append('file', image);
  
      try {
        console.log('Uploading image:', image.name); // ファイル名を確認
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });
  
        if (!res.ok) {
          const errorData = await res.json();
          console.error('Image upload failed:', errorData.message); // エラーメッセージを表示
          continue;
        }
  
        const data = await res.json();
        console.log('Uploaded image URL:', data.url); // 成功したURLをログ
        urls.push(data.url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    setUploadedImageUrls(urls);
    return urls;
  };
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingQuestion) return; // 質問作成中なら何もしない
    const imageUrls = await uploadImages();
    console.log('Collected Image URLs:', imageUrls); // 画像URLを確認

    setIsSubmittingQuestion(true); // 質問作成中を設定
    try {
      const res = await fetch('/api/create-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          tags: selectedTags.map(tag => tag.name),
          images: imageUrls,
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
      setIsSubmittingQuestion(false); // 質問作成処理終了
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
            <input type="file" multiple onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
        </div>
        <div>
          {images.map((file, idx) => (
            <p key={idx}>{file.name}</p>
          ))}
        </div>
        <div className={styles.buttonGroup}>
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
