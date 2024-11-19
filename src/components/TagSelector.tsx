import React, { useState, useEffect } from 'react';

type Tag = {
  id: number;
  name: string;
};

const TagSelector = ({ selectedTags, setSelectedTags }: { selectedTags: Tag[]; setSelectedTags: (tags: Tag[]) => void }) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [query, setQuery] = useState('');
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [confirmCreate, setConfirmCreate] = useState(false); // タグ作成の確認フラグ

  // タグ一覧を取得する
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

  // 入力に基づいてタグ候補をフィルタリング
  useEffect(() => {
    if (!query.trim()) {
      setFilteredTags([]);
      setConfirmCreate(false); // クエリが空の場合、作成確認をリセット
    } else {
      setFilteredTags(allTags.filter(tag => tag.name.includes(query) && !selectedTags.some(t => t.id === tag.id)));
    }
  }, [query, allTags, selectedTags]);

  // タグを選択したときの処理
  const handleSelectTag = (tag: Tag) => {
    setSelectedTags([...selectedTags, tag]);
    setQuery(''); // 入力フィールドをクリア
    setConfirmCreate(false); // 作成確認をリセット
  };

  // 新しいタグを作成して選択する
  const handleCreateTag = async (name: string) => {
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
        setQuery(''); // 入力フィールドをクリア
        setConfirmCreate(false); // 作成確認をリセット
      } else {
        console.error('Failed to create tag');
      }
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  // エンターキーが押された時の処理
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // フォーム送信を防止

      if (!query.trim()) {
        return; // 空白の場合は何もしない
      }

      const existingTag = allTags.find(tag => tag.name === query.trim());

      if (existingTag) {
        handleSelectTag(existingTag); // 既存タグを選択
      } else if (!confirmCreate) {
        setConfirmCreate(true); // 1回目のエンターで作成確認を有効化
      } else {
        handleCreateTag(query.trim()); // 2回目のエンターでタグを作成
      }
    }
  };

  // 選択したタグを削除する
  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  return (
    <div>
      <div>
        {selectedTags.map(tag => (
          <span key={tag.id} style={{ margin: '0 5px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}>
            {tag.name} <button onClick={() => handleRemoveTag(tag.id)}>×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress} // エンターキー検知
        placeholder="タグを入力してエンターを押してください"
        style={{ width: '100%', padding: '8px', marginTop: '10px' }}
      />
      {confirmCreate && (
        <div style={{ color: 'red', marginTop: '5px' }}>
          「{query}」を新しいタグとして作成しますか？もう一度エンターを押してください。
        </div>
      )}
      {filteredTags.length > 0 && (
        <div style={{ border: '1px solid #ccc', marginTop: '5px', borderRadius: '4px', maxHeight: '100px', overflowY: 'auto' }}>
          {filteredTags.map(tag => (
            <div
              key={tag.id}
              onClick={() => handleSelectTag(tag)}
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
