import React, { useState, useEffect } from 'react';

type Tag = {
  id: number;
  name: string;
};

const TagSelector = ({
  selectedTags,
  setSelectedTags,
  isProcessing,
  setIsProcessing,
}: {
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [query, setQuery] = useState('');
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [confirmCreate, setConfirmCreate] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch('/api/get-tags');
      if (response.ok) {
        const tags = await response.json();
        setAllTags(tags);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredTags([]);
      setConfirmCreate(false); // 入力が空の場合、作成確認をリセット
    } else {
      setFilteredTags(
        allTags.filter(tag => tag.name.includes(query) && !selectedTags.some(t => t.id === tag.id))
      );
    }
  }, [query, allTags, selectedTags]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // フォーム送信を防止

      if (isProcessing) return; // 処理中なら何もしない
      if (!query.trim()) return; // 入力が空なら何もしない

      const existingTag = allTags.find(tag => tag.name === query.trim());

      if (existingTag) {
        setSelectedTags([...selectedTags, existingTag]);
        setQuery('');
        setConfirmCreate(false);
      } else if (!confirmCreate) {
        setConfirmCreate(true); // 1回目のエンターで作成確認を有効化
      } else {
        handleCreateTag(query.trim()); // 2回目のエンターでタグを作成
      }
    }
  };

  const handleCreateTag = async (name: string) => {
    if (isProcessing) return; // 処理中なら無視

    setIsProcessing(true); // 処理中を開始
    try {
      const response = await fetch('/api/create-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const newTag: Tag = await response.json();
        setAllTags([...allTags, newTag]); // 全タグリストに新しいタグを追加
        setSelectedTags([...selectedTags, newTag]); // 選択済みタグに新しいタグを追加
        setQuery('');
      } else {
        console.error('Failed to create tag');
      }
    } catch (error) {
      console.error('Error creating tag:', error);
    } finally {
      setIsProcessing(false); // 処理終了
    }
  };

  const handleRemoveTag = (tagId: number) => {
    if (isProcessing) return; // 処理中なら何もしない
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  return (
    <div>
      <div>
        {selectedTags.map(tag => (
          <span key={tag.id} style={{ margin: '0 5px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}>
            {tag.name} <button onClick={() => handleRemoveTag(tag.id)} disabled={isProcessing}>
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="タグを入力してエンターを押してください"
        disabled={isProcessing} // 処理中は入力を無効化
        style={{ width: '100%', padding: '8px', marginTop: '10px' }}
      />
      {confirmCreate && !isProcessing && (
        <div style={{ color: 'red', marginTop: '5px' }}>
          「{query}」を新しいタグとして作成しますか？もう一度エンターを押してください。
        </div>
      )}
      {isProcessing && (
        <div style={{ color: 'blue', marginTop: '5px' }}>
          タグを作成中です。しばらくお待ちください...
        </div>
      )}
      {filteredTags.length > 0 && (
        <div style={{ border: '1px solid #ccc', marginTop: '5px', borderRadius: '4px', maxHeight: '100px', overflowY: 'auto' }}>
          {filteredTags.map(tag => (
            <div
              key={tag.id}
              onClick={() => setSelectedTags([...selectedTags, tag])}
              style={{ padding: '8px', cursor: 'pointer' }}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
